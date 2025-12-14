'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ReviewLike extends Model {
        static associate(models) {
            ReviewLike.belongsTo(models.Review, {
                foreignKey: 'review_id',
                onDelete: 'CASCADE'
            });

            ReviewLike.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });
        }
    }

    ReviewLike.init({
        review_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ReviewLike',
        tableName: 'ReviewLikes',
        timestamps: true
    });

    return ReviewLike;
};
