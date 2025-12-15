'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Wishlists', {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
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
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // ⭐ 복합 PK
        await queryInterface.addConstraint('Wishlists', {
            fields: ['user_id', 'book_id'],
            type: 'primary key',
            name: 'pk_wishlists'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Wishlists');
    }
};
