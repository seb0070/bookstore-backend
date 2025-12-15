'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Wishlist extends Model {
        static associate(models) {
            Wishlist.belongsTo(models.User, { foreignKey: 'user_id' });
            Wishlist.belongsTo(models.Book, { foreignKey: 'book_id' });
        }
    }

    Wishlist.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Wishlist',
            tableName: 'Wishlists',
            timestamps: true
        }
    );

    return Wishlist;
};
