'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CommentLike extends Model {
        static associate(models) {
            CommentLike.belongsTo(models.User, { foreignKey: 'user_id' });
            CommentLike.belongsTo(models.Comment, { foreignKey: 'comment_id' });
        }
    }

    CommentLike.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            comment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'CommentLike',
            tableName: 'comment_likes',
            timestamps: false,
            underscored: true,
        }
    );

    return CommentLike;
};