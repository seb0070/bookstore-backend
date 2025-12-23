const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.createUser = async ({ email, password, name }) => {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
        const error = new Error('EMAIL_ALREADY_EXISTS');
        error.status = 409;
        throw error;
    }

    const hashed = await bcrypt.hash(password, 10);

    return User.create({
        email,
        password_hash: hashed,
        name,
        role: 'USER',
    });
};

exports.getMe = async (userId) => {
    return User.findByPk(userId, {
        attributes: ['id', 'email', 'name', 'role', 'created_at'],
    });
};

exports.updateMe = async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error('USER_NOT_FOUND');
        error.status = 404;
        throw error;
    }

    if (data.password) {
        data.password_hash = await bcrypt.hash(data.password, 10);
        delete data.password;
    }

    await user.update(data);
    return user;
};

exports.getUsers = async () => {
    return User.findAll({
        attributes: ['id', 'email', 'name', 'role', 'status'],
    });
};

exports.getUserById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        const error = new Error('USER_NOT_FOUND');
        error.status = 404;
        throw error;
    }
    return user;
};

exports.deactivateUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        const error = new Error('USER_NOT_FOUND');
        error.status = 404;
        throw error;
    }

    await user.update({ status: 'INACTIVE' });
};
