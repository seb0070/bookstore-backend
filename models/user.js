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