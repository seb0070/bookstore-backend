'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_refresh_tokens', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },

            refresh_token: {
                type: Sequelize.STRING(500),
                allowNull: false,
                unique: true,
            },

            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('user_refresh_tokens', ['user_id'], {
            name: 'idx_refresh_tokens_user',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('user_refresh_tokens');
    },
};
