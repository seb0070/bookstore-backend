'use strict';
const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface) {
        const passwordHash = bcrypt.hashSync('P@ssw0rd!', 10);

        await queryInterface.bulkInsert('users', [
            {
                email: 'admin@example.com',
                name: '관리자',
                password_hash: passwordHash,
                role: 'ADMIN',
                status: 'ACTIVE',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                email: 'user1@example.com',
                name: '일반 사용자',
                password_hash: passwordHash,
                role: 'USER',
                status: 'ACTIVE',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', {
            email: ['admin@example.com', 'user1@example.com'],
        });
    },
};
