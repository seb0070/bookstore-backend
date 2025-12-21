'use strict';
module.exports = (sequelize, DataTypes) => {
    const CommentLike = sequelize.define(
        'CommentLike',
        {},
        {
            tableName: 'comment_likes',
            timestamps: false,
            underscored: true,
        }
    );
    return CommentLike;
};
