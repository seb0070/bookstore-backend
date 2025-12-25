'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'order_id',
                as: 'items',
            });
        }
    }

    Order.init(
        {
            status: {
                // ERD와 일치하도록 3개만 유지
                type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            underscored: true,
            timestamps: true,
        }
    );

    return Order;
};