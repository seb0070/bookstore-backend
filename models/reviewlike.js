'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // 리뷰 좋아요 → 리뷰
        ReviewLike.belongsTo(models.Review, { foreignKey: 'review_id' });

        // 리뷰 좋아요 → 사용자
        ReviewLike.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
    ReviewLike.init(
        {
            review_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ReviewLike',
            tableName: 'ReviewLikes',
            timestamps: true
        }
    );

    return ReviewLike;
};