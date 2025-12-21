'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('review_likes', {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },
            review_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'reviews', key: 'id' },
                onDelete: 'CASCADE',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addConstraint('review_likes', {
            fields: ['user_id', 'review_id'],
            type: 'primary key',
            name: 'pk_review_likes',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('review_likes');
    },
};
