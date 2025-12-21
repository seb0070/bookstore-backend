'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            review_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'reviews', key: 'id' },
                onDelete: 'CASCADE',
            },

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },

            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            likes_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('comments', ['review_id'], { name: 'idx_comments_review' });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('comments');
    },
};
