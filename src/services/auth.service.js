const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const e = new Error('UNAUTHORIZED');
        e.status = 401;
        throw e;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        const e = new Error('UNAUTHORIZED');
        e.status = 401;
        throw e;
    }

    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { accessToken };
};
