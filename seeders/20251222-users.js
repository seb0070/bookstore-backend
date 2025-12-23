const bcrypt = require('bcrypt');

'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('users', [
            {
                email: 'admin@example.com',
                name: '관리자',
                password_hash: bcrypt.hashSync('P@ssw0rd!', 10),
                role: 'ROLE_ADMIN',
                created_at: new Date(),
                updated_at: new Date(),
            }
        ]);

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
