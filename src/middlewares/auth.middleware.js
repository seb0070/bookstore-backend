const jwt = require('jsonwebtoken');

const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ code: 'UNAUTHORIZED' });
    }

    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch {
        return res.status(401).json({ code: 'TOKEN_EXPIRED' });
    }
};

exports.authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ code: 'FORBIDDEN' });
    }
    next();
};
