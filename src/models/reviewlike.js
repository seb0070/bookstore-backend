// reviewlike.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ReviewLike extends Model {
        static associate(models) {
            ReviewLike.belongsTo(models.User, { foreignKey: 'user_id' });
            ReviewLike.belongsTo(models.Review, { foreignKey: 'review_id' });
        }
    }

    ReviewLike.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            review_id: {
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
            modelName: 'ReviewLike',
            tableName: 'review_likes',
            timestamps: false,
            underscored: true,
        }
    );

    return ReviewLike;
};