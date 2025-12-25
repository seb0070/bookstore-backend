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
                type: Sequelize.ENUM('USER', 'ADMIN'),
                allowNull: false,
                defaultValue: 'USER',
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        // 인덱스 추가 - 검색/조회 성능 향상
        await queryInterface.addIndex('users', ['email'], {
            name: 'idx_users_email',
        });
        await queryInterface.addIndex('users', ['status'], {
            name: 'idx_users_status',
        });
        await queryInterface.addIndex('users', ['role'], {
            name: 'idx_users_role',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('users');
    },
};