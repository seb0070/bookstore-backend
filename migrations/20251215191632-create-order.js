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
                onDelete: 'RESTRICT',
            },

            status: {
                type: Sequelize.ENUM(
                    'PENDING',
                    'PAID',
                    'SHIPPED',
                    'COMPLETED',
                    'CANCELLED'
                ),
                allowNull: false,
                defaultValue: 'PENDING',
            },

            total_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
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

        await queryInterface.addIndex('orders', ['user_id'], { name: 'idx_orders_user' });
        await queryInterface.addIndex('orders', ['status'], { name: 'idx_orders_status' });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('orders');
    },
};
