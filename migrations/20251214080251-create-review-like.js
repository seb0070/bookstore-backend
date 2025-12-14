'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ReviewLikes', {
            review_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Reviews',
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
        await queryInterface.addConstraint('ReviewLikes', {
            fields: ['review_id', 'user_id'],
            type: 'primary key',
            name: 'pk_review_likes'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ReviewLikes');
    }
};
