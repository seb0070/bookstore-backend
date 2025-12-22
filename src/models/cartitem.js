'use strict';
module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define(
        'CartItem',
        {
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: { min: 1 },
            },
        },
        {
            tableName: 'cart_items',
            timestamps: false,
            underscored: true,
        }
    );
    return CartItem;
};
