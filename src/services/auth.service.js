const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, UserRefreshToken } = require('../models');

function signAccessToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
}

function signRefreshToken(user) {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
}

exports.signup = async ({ email, password, name, birthDate, gender, address, phoneNumber }) => {
    // 이메일 중복 확인
    const exists = await User.findOne({ where: { email } });
    if (exists) {
        const error = new Error('이미 존재하는 이메일입니다.');
        error.status = 409;
        error.code = 'DUPLICATE_EMAIL';
        throw error;
    }

    // 비밀번호 해시화
    const passwordHash = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await User.create({
        email,
        password_hash: passwordHash,
        name,
        birth_date: birthDate,
        gender,
        address,
        phone_number: phoneNumber,
        role: 'USER',
        status: 'ACTIVE'
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    };
};

exports.login = async (email, password) => {
    // 사용자 조회
    const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'name', 'role', 'status', 'password_hash'],
    });

    if (!user) {
        const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        error.status = 401;
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
        const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        error.status = 401;
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    // 계정 상태 확인
    if (user.status === 'BLOCKED') {
        const error = new Error('차단된 계정입니다.');
        error.status = 403;
        error.code = 'ACCOUNT_BLOCKED';
        throw error;
    }

    if (user.status === 'DELETED') {
        const error = new Error('삭제된 계정입니다.');
        error.status = 403;
        error.code = 'ACCOUNT_DELETED';
        throw error;
    }

    // 토큰 생성
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Refresh Token DB 저장
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후

    await UserRefreshToken.create({
        user_id: user.id,
        refresh_token: refreshToken,
        expires_at: expiresAt
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    };
};

exports.logout = async (userId) => {
    // 해당 사용자의 모든 refresh token 삭제
    await UserRefreshToken.destroy({
        where: { user_id: userId }
    });

    return true;
};

exports.refresh = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('리프레시 토큰이 필요합니다.');
        error.status = 401;
        error.code = 'UNAUTHORIZED';
        throw error;
    }

    // DB에 저장된 refresh token인지 확인
    const savedToken = await UserRefreshToken.findOne({
        where: { refresh_token: refreshToken }
    });

    if (!savedToken) {
        const error = new Error('유효하지 않은 리프레시 토큰입니다.');
        error.status = 401;
        error.code = 'INVALID_TOKEN';
        throw error;
    }

    // 만료 확인
    if (new Date(savedToken.expires_at) < new Date()) {
        await savedToken.destroy();
        const error = new Error('만료된 리프레시 토큰입니다.');
        error.status = 401;
        error.code = 'TOKEN_EXPIRED';
        throw error;
    }

    // Refresh token 검증
    let payload;
    try {
        payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
        );
    } catch (err) {
        const error = new Error('유효하지 않은 토큰입니다.');
        error.status = 401;
        error.code = 'INVALID_TOKEN';
        throw error;
    }

    // 사용자 정보 조회
    const user = await User.findByPk(payload.id);
    if (!user) {
        const error = new Error('사용자를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    // 새 Access Token 발급
    const newAccessToken = signAccessToken(user);

    return {
        accessToken: newAccessToken
    };
};