'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserRefreshToken = sequelize.define(
        'UserRefreshToken',
        {
            refresh_token: {
                type: DataTypes.STRING(500),
                allowNull: false,
                unique: true,
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'user_refresh_tokens',
            timestamps: false,
            underscored: true,
        }
    );

    UserRefreshToken.associate = (models) => {
        UserRefreshToken.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
    };

    return UserRefreshToken;
};
