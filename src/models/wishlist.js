'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'order'
            });
            OrderItem.belongsTo(models.Book, {
                foreignKey: 'book_id',
                as: 'book'
            });
        }
    }

    OrderItem.init(
        {
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 1 },
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'order_items',
            underscored: true,
            timestamps: false, // created_at만 수동 관리
        }
    );

    return OrderItem;
};