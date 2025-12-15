'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        UserRefreshToken.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
  }
  UserRefreshToken.init({
    user_id: DataTypes.INTEGER,
    refresh_token: DataTypes.STRING,
    expires_at: DataTypes.DATE
  }, {
      modelName: 'UserRefreshToken',
      tableName: 'UserRefreshTokens',
      timestamps: false // createdAt/updatedAt 자동 컬럼 쓰는지에 따라 결정
  });
  return UserRefreshToken;
};