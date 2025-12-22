'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: 'user_id' });
            Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
        }
    }

    Cart.init(
        {},
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
