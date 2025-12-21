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
            },

            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
        });

        await queryInterface.addConstraint('order_items', {
            fields: ['order_id', 'book_id'],
            type: 'primary key',
            name: 'pk_order_items',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('order_items');
    },
};
