'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.Cart, {
                foreignKey: 'cart_id'
            });
            CartItem.belongsTo(models.Book, {
                foreignKey: 'book_id',
                as: 'book'
            });
        }
    }

    CartItem.init(
        {
            cart_id: {
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
                defaultValue: 1,
                validate: { min: 1 },
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'CartItem',
            tableName: 'cart_items',
            underscored: true,
            timestamps: false, // created_at만 수동 관리
        }
    );

    return CartItem;
};