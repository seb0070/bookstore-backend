'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE', // RESTRICT에서 CASCADE로 변경 (ERD 기준)
            },
            total_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                // ERD와 일치하도록 3가지만 유지
                type: Sequelize.ENUM('PENDING', 'PAID', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
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

        // 인덱스 추가
        await queryInterface.addIndex('orders', ['user_id'], {
            name: 'idx_orders_user'
        });
        await queryInterface.addIndex('orders', ['status'], {
            name: 'idx_orders_status'
        });
        await queryInterface.addIndex('orders', ['created_at'], {
            name: 'idx_orders_created_at' // 추가! 날짜별 조회용
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('orders');
    },
};