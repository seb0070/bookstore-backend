'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Review, {
                foreignKey: 'review_id',
                as: 'review'
            });
            Comment.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Comment.belongsToMany(models.User, {
                through: models.CommentLike,
                foreignKey: 'comment_id',
                otherKey: 'user_id',
                as: 'likedBy'
            });
        }
    }

    Comment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            likes_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'Comment',
            tableName: 'comments',
            underscored: true,
            timestamps: true,
        }
    );

    return Comment;
};