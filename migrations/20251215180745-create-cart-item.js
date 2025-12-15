'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CartItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Carts',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },

            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Books',
                    key: 'id'
                },
                onDelete: 'RESTRICT'
            },

            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            unit_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CartItems');
    }
};
