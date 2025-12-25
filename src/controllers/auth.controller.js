const authService = require('../services/auth.service');

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