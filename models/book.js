'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        static associate(models) {
            // Book(1) : Review(N)
            Book.hasMany(models.Review, { foreignKey: 'book_id' });

            // Book(1) : Wishlist(N)
            Book.hasMany(models.Wishlist, {
                foreignKey: 'book_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            // Book(1) : CartItem(N)
            Book.hasMany(models.CartItem, {
                foreignKey: 'book_id',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            });

            Book.hasMany(models.OrderItem, {
                foreignKey: 'book_id'
            });



        }
    }

    Book.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            price: DataTypes.DECIMAL,
            stock_quantity: DataTypes.INTEGER,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Book',
            tableName: 'Books',
            timestamps: true,
        }
    );

    return Book;
};
