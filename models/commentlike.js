'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CommentLike extends Model {
        static associate(models) {
            CommentLike.belongsTo(models.Comment, {
                foreignKey: 'comment_id',
                onDelete: 'CASCADE'
            });

            CommentLike.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });
        }
    }

    CommentLike.init({
        comment_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'CommentLike',
        tableName: 'CommentLikes',
        timestamps: true
    });

    return CommentLike;
};
