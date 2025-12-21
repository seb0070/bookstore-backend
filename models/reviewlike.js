'use strict';
module.exports = (sequelize, DataTypes) => {
    const ReviewLike = sequelize.define(
        'ReviewLike',
        {},
        {
            tableName: 'review_likes',
            timestamps: false,
            underscored: true,
        }
    );
    return ReviewLike;
};
