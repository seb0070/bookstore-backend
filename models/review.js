'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Review.belongsTo(models.User, { foreignKey: 'user_id' });
        Review.belongsTo(models.Book, { foreignKey: 'book_id' });
        Review.hasMany(models.ReviewLike, { foreignKey: 'review_id' });
    }
  }
  Review.init({
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};