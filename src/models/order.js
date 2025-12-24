'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
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
                type: DataTypes.ENUM(
                    'PENDING',
                    'PAID',
                    'SHIPPED',
                    'COMPLETED',
                    'CANCELLED'
                ),
                allowNull: false,
                defaultValue: 'PENDING',
            },

            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0, // ⭐ 주문 생성 시 편함
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
