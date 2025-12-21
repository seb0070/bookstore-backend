'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cart_items', {
            cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'carts', key: 'id' },
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
                defaultValue: 1,
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addConstraint('cart_items', {
            fields: ['cart_id', 'book_id'],
            type: 'primary key',
            name: 'pk_cart_items',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('cart_items');
    },
};
