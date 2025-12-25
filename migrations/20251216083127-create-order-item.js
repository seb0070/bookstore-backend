'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_items', {
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'orders', key: 'id' },
                onDelete: 'CASCADE',
            },
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'books', key: 'id' },
                onDelete: 'RESTRICT',
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            created_at: { // 추가! (ERD에 있음)
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addConstraint('order_items', {
            fields: ['order_id', 'book_id'],
            type: 'primary key',
            name: 'pk_order_items',
        });

        // 인덱스 추가
        await queryInterface.addIndex('order_items', ['book_id'], {
            name: 'idx_order_items_book'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('order_items');
    },
};