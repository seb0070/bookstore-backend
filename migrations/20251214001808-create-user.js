'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },

            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            gender: {
                type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
                allowNull: true,
            },

            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },

            address: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            role: {
                type: Sequelize.ENUM('ROLE_USER', 'ROLE_ADMIN'),
                allowNull: false,
                defaultValue: 'ROLE_USER',
            },

            status: {
                type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'DELETED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },

            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
                ),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('users');
    },
};
