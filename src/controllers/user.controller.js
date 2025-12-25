const userService = require('../services/user.service');

exports.createUser = async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
};

exports.getMe = async (req, res) => {
    const user = await userService.getMe(req.user.id);
    res.json(user);
};

exports.updateMe = async (req, res) => {
    const user = await userService.updateMe(req.user.id, req.body);
    res.json(user);
};

exports.getUsers = async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
};

exports.getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await userService.updateUserStatus(id, status);

        res.status(200).json({
            message: '사용자 상태가 변경되었습니다',
        });
    } catch (err) {
        next(err);
    }
};
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};


