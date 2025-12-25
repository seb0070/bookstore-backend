const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.getMe = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'name', 'birth_date', 'gender', 'address', 'phone_number', 'role', 'status', 'created_at']
    });

    if (!user) {
        const error = new Error('사용자를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    return user;
};

exports.updateMe = async (userId, data) => {
    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error('사용자를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    // 비밀번호 변경 시 해시화
    if (data.password) {
        data.password_hash = await bcrypt.hash(data.password, 10);
        delete data.password;
    }

    await user.update(data);

    // 비밀번호 해시 제거 후 반환
    const { password_hash, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
};

exports.deleteMe = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error('사용자를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    await user.update({
        status: 'DELETED',
        deleted_at: new Date()
    });

    return true;
};

// ADMIN
exports.getUsers = async (query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 20;
    const offset = page * size;

    const { rows: users, count } = await User.findAndCountAll({
        attributes: ['id', 'email', 'name', 'role', 'status', 'created_at'],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: users,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};

exports.getUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: ['id', 'email', 'name', 'birth_date', 'gender', 'address', 'phone_number', 'role', 'status', 'created_at', 'updated_at']
    });

    if (!user) {
        const error = new Error('사용자를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    return user;
};

exports.updateUserStatus = async (userId, status) => {
    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error('사용자를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    if (user.status === status) {
        const error = new Error('이미 해당 상태입니다.');
        error.status = 409;
        error.code = 'STATE_CONFLICT';
        throw error;
    }

    await user.update({
        status,
        ...(status === 'DELETED' && { deleted_at: new Date() })
    });

    return user;
};