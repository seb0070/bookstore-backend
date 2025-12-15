'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });

            Cart.hasMany(models.CartItem, {
                foreignKey: 'cart_id',
                onDelete: 'CASCADE'
            });
        }
    }

    Cart.init(
        {
            user_id: DataTypes.INTEGER,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Cart',
            tableName: 'Carts'
        }
    );

    return Cart;
};
