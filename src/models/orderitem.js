'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'order_id',
            });

            OrderItem.belongsTo(models.Book, {
                foreignKey: 'book_id',
            });
        }
    }

    OrderItem.init(
        {
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'order_items',
            underscored: true,
            timestamps: true, // ⭐ Order와 통일
        }
    );

    return OrderItem;
};
