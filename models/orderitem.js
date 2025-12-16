'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            // 주문 아이템 → 주문
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'order_id'
            });

            // 주문 아이템 → 도서
            OrderItem.belongsTo(models.Book, {
                foreignKey: 'book_id'
            });
        }
    }

    OrderItem.init(
        {
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            unit_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'OrderItems',
            timestamps: true,
            updatedAt: false
        }
    );

    return OrderItem;
};
