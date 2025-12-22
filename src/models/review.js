'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'user_id' });
            Review.belongsTo(models.Book, { foreignKey: 'book_id' });
            Review.hasMany(models.Comment, { foreignKey: 'review_id' });
        }
    }

    Review.init(
        {
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 1, max: 5 },
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
            modelName: 'Review',
            tableName: 'reviews',
            underscored: true,
            timestamps: true,
        }
    );

    return Review;
};
