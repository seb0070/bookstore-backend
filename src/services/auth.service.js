const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, UserRefreshToken } = require('../models');

function signAccessToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

function signRefreshToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
}

exports.login = async (email, password) => {
    // 1) 사용자 조회
    const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'role', 'password_hash'],
    });

    if (!user) {
        const error = new Error('UNAUTHORIZED');
        error.status = 401;
        throw error;
    }

    // 2) 비밀번호 비교
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        const error = new Error('UNAUTHORIZED');
        error.status = 401;
        throw error;
    }

    // 3) 토큰 생성
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 4) refresh token DB 저장
    // ⚠️ 컬럼명이 refresh_token인지 refreshToken인지 모델 정의에 맞춰야 함
    await UserRefreshToken.create({
        user_id: user.id,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d 예시
    });

    // 5) 둘 다 반환 (과제 필수)
    return { accessToken, refreshToken };
};

exports.refresh = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('UNAUTHORIZED');
        error.status = 401;
        throw error;
    }

    // 1) DB에 저장된 refresh token인지 확인
    const savedToken = await UserRefreshToken.findOne({
        where: { refresh_token: refreshToken }, // (token 아님)
    });

    if (!savedToken) {
        const error = new Error('UNAUTHORIZED');
        error.status = 401;
        throw error;
    }

    // 2) refresh token 검증
    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        const error = new Error('TOKEN_EXPIRED');
        error.status = 401;
        throw error;
    }

    // 3) 새 access token 발급
    const newAccessToken = jwt.sign(
        { id: payload.id, role: payload.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { accessToken: newAccessToken };
};
