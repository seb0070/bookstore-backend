const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * 인증: Access Token 검증 + DB 사용자 상태 확인
 */
exports.authenticate = async (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        const error = new Error('UNAUTHORIZED');
        error.status = 401;
        throw error;
    }

    const token = auth.split(' ')[1];

    try {
        // 1️⃣ 토큰 검증 (payload에는 id, role 정도만 있다고 가정)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2️⃣ DB에서 최신 사용자 정보 조회
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'role', 'status'],
        });

        if (!user) {
            const error = new Error('UNAUTHORIZED');
            error.status = 401;
            throw error;
        }

        // 3️⃣ 사용자 상태 체크
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ code: 'USER_BLOCKED' });
        }

        // 4️⃣ 이후 미들웨어에서 쓸 user 정보 통일
        req.user = {
            id: user.id,
            role: user.role,
            status: user.status,
        };

        next();
    } catch (err) {
        const error = new Error('TOKEN_EXPIRED');
        error.status = 401;
        throw error;
    }
};

/**
 * 인가: 역할 기반 접근 제어
 */
exports.authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        const error = new Error('FORBIDDEN');
        error.status = 403;
        throw error;
    }
    next();
};
