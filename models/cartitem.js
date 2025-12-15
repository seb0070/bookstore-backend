'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            // CartItem → Cart
            CartItem.belongsTo(models.Cart, {
                foreignKey: 'cart_id',
                onDelete: 'CASCADE'
            });

            // CartItem → Book
            CartItem.belongsTo(models.Book, {
                foreignKey: 'book_id',
                onDelete: 'CASCADE'
            });
        }
    }

    CartItem.init(
        {
            cart_id: DataTypes.INTEGER,
            book_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            unit_price: DataTypes.DECIMAL(10, 2)
        },
        {
            sequelize,
            modelName: 'CartItem',
            tableName: 'CartItems'
        }
    );

    return CartItem;
};
