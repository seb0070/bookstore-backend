'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserRefreshToken extends Model {
        static associate(models) {
            UserRefreshToken.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
                onDelete: 'CASCADE',
            });
        }
    }

    UserRefreshToken.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            refresh_token: {
                type: DataTypes.STRING(500),
                allowNull: false,
                unique: true,
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'UserRefreshToken',
            tableName: 'user_refresh_tokens',
            timestamps: false,
            underscored: true,
        }
    );

    return UserRefreshToken;
};