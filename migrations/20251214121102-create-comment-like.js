'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CommentLikes', {
            comment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Comments',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
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
        await queryInterface.addConstraint('CommentLikes', {
            fields: ['comment_id', 'user_id'],
            type: 'primary key',
            name: 'pk_comment_likes'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CommentLikes');
    }
};
