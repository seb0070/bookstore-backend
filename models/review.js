'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });

            Review.belongsTo(models.Book, {
                foreignKey: 'book_id',
                onDelete: 'CASCADE'
            });

            Review.hasMany(models.ReviewLike, {
                foreignKey: 'review_id',
                onDelete: 'CASCADE'
            });

            Review.hasMany(models.Comment, {
                foreignKey: 'review_id',
                onDelete: 'CASCADE'
            });
        }
    }

    Review.init({
        user_id: DataTypes.INTEGER,
        book_id: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
        content: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Review'
    });

    return Review;
};
