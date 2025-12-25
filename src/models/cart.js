'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Cart.hasMany(models.CartItem, {
                foreignKey: 'cart_id',
                as: 'items'
            });
            // N+1 방지: CartItem을 통해 Book 조회
            Cart.belongsToMany(models.Book, {
                through: models.CartItem,
                foreignKey: 'cart_id',
                otherKey: 'book_id',
                as: 'books'
            });
        }
    }

    Cart.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            }
        },
        {
            sequelize,
            modelName: 'Cart',
            tableName: 'carts',
            underscored: true,
            timestamps: true,
        }
    );

    return Cart;
};