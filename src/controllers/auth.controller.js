const authService = require('../services/auth.service');
const passport = require('../../config/passport');
const admin = require('../../config/firebase');

exports.signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        res.status(200).json({
            message: '로그아웃되었습니다.'
        });
    } catch (err) {
        next(err);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refresh(refreshToken);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// Google OAuth 시작
exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
});

// Google OAuth 콜백
exports.googleAuthCallback = async (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(401).json({
                    timestamp: new Date().toISOString(),
                    path: req.path,
                    status: 401,
                    code: 'GOOGLE_AUTH_FAILED',
                    message: '구글 인증에 실패했습니다.',
                    details: err ? err.message : info
                });
            }

            const jwt = require('jsonwebtoken');
            const { UserRefreshToken } = require('../models');

            // JWT 토큰 생성
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
            );

            // Refresh Token DB에 저장
            await UserRefreshToken.create({
                user_id: user.id,
                token: refreshToken,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            // 사용자 정보 업데이트
            await user.update({ last_login_at: new Date() });

            // JSON 응답
            res.status(200).json({
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    provider: user.provider
                }
            });
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};

// Firebase Auth 로그인
exports.firebaseAuth = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                path: req.path,
                status: 400,
                code: 'MISSING_ID_TOKEN',
                message: 'Firebase ID Token이 필요합니다.',
                details: { idToken: 'required' }
            });
        }

        const jwt = require('jsonwebtoken');
        const { User, UserRefreshToken } = require('../models');

        // Firebase ID Token 검증
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;

        // 사용자 찾기 또는 생성
        let user = await User.findOne({
            where: {
                provider: 'FIREBASE',
                provider_id: uid
            }
        });

        if (!user) {
            // 같은 이메일로 기존 계정 확인
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                // 기존 계정을 Firebase로 연동
                user = await existingUser.update({
                    provider: 'FIREBASE',
                    provider_id: uid
                });
            } else {
                // 새 사용자 생성
                user = await User.create({
                    email,
                    name: name || email.split('@')[0],
                    provider: 'FIREBASE',
                    provider_id: uid,
                    role: 'USER',
                    is_active: true
                });
            }
        }

        // JWT 토큰 생성
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
        );

        // Refresh Token 저장
        await UserRefreshToken.create({
            user_id: user.id,
            token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // 로그인 시간 업데이트
        await user.update({ last_login_at: new Date() });

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                provider: user.provider
            }
        });
    } catch (error) {
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                path: req.path,
                status: 401,
                code: 'TOKEN_EXPIRED',
                message: 'Firebase ID Token이 만료되었습니다.',
                details: null
            });
        }

        if (error.code === 'auth/argument-error') {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                path: req.path,
                status: 400,
                code: 'INVALID_ID_TOKEN',
                message: '유효하지 않은 Firebase ID Token입니다.',
                details: null
            });
        }

        next(error);
    }
};