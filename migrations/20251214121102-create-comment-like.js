'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('comment_likes', {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },
            comment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'comments', key: 'id' },
                onDelete: 'CASCADE',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addConstraint('comment_likes', {
            fields: ['user_id', 'comment_id'],
            type: 'primary key',
            name: 'pk_comment_likes',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('comment_likes');
    },
};
