const authService = require('../services/auth.service');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        res.json(token);
    } catch (e) {
        next(e);
    }
};
