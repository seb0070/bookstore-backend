'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            // 주문은 한 사용자에 속함
            Order.belongsTo(models.User, {
                foreignKey: 'user_id'
            });
        }
    }
  Order.init({
      user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      total_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
      },
      status: {
          type: DataTypes.STRING,
          allowNull: false
      }
  },{
      sequelize,
      modelName: 'Order',
      tableName: 'Orders'
  });

    return Order;
};