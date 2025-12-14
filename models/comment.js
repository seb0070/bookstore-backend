'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Review, {
                foreignKey: 'review_id',
                onDelete: 'CASCADE'
            });

            Comment.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });

            Comment.hasMany(models.CommentLike, {
                foreignKey: 'comment_id',
                onDelete: 'CASCADE'
            });
        }
    }

    Comment.init({
        review_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        content: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Comment'
    });

    return Comment;
};
