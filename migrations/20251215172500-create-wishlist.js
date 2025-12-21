'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('wishlists', {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },

            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'books', key: 'id' },
                onDelete: 'CASCADE',
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addConstraint('wishlists', {
            fields: ['user_id', 'book_id'],
            type: 'primary key',
            name: 'pk_wishlists',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('wishlists');
    },
};
