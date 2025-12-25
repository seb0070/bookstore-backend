const userService = require('../services/user.service');

exports.getMe = async (req, res, next) => {
    try {
        const user = await userService.getMe(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateMe(req.user.id, req.body);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        await userService.deleteMe(req.user.id);
        res.status(200).json({
            message: '계정이 삭제되었습니다.'
        });
    } catch (err) {
        next(err);
    }
};

// ADMIN
exports.getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers(req.query);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await userService.updateUserStatus(id, status);

        res.status(200).json({
            message: '사용자 상태가 변경되었습니다.'
        });
    } catch (err) {
        next(err);
    }
};