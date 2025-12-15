'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        User.hasMany(models.Review, { foreignKey: 'user_id' });
        User.hasMany(models.ReviewLike, { foreignKey: 'user_id' });
        User.hasMany(models.Comment, { foreignKey: 'user_id'});
        User.hasMany(models.CommentLike, { foreignKey: 'user_id' });
        User.hasMany(models.UserRefreshToken, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.Wishlist, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });

    }
  }
  User.init({
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};