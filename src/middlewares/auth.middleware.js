const jwt = require('jsonwebtoken');

/**
 * 인증: Access Token 검증
 */
exports.authenticate = (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        const error = new Error('UNAUTHORIZED');
        error.status = 401;
        throw error;
    }

    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
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
