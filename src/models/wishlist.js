'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Wishlist extends Model {
        static associate(models) {
            Wishlist.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Wishlist.belongsTo(models.Book, {
                foreignKey: 'book_id',
                as: 'book'
            });
        }
    }

    Wishlist.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'Wishlist',
            tableName: 'wishlists',
            timestamps: false,
            underscored: true,
        }
    );

    return Wishlist;
};