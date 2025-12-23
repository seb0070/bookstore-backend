'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        static associate(models) {
            Book.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator',
            });

            // Book.hasMany(models.Review, { foreignKey: 'book_id' });
            // Book.hasMany(models.CartItem, { foreignKey: 'book_id' });
            // Book.hasMany(models.OrderItem, { foreignKey: 'book_id' });
        }
    }

    Book.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            description: {
                type: DataTypes.TEXT,
            },

            isbn: {
                type: DataTypes.STRING(50),
                unique: true,
            },

            authors: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            categories: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            publisher: {
                type: DataTypes.STRING(255),
            },

            published_year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            stock_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },

            status: {
                type: DataTypes.ENUM('ACTIVE', 'DELETED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },

            deleted_at: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'Book',
            tableName: 'books',
            underscored: true,   // ⭐ snake_case 핵심
            timestamps: true,   // created_at / updated_at
        }
    );

    return Book;
};
