'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserRefreshToken extends Model {
        static associate(models) {
            UserRefreshToken.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    UserRefreshToken.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            refresh_token: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'UserRefreshToken',
            tableName: 'UserRefreshTokens',
            timestamps: false
        }
    );

    return UserRefreshToken;
};

