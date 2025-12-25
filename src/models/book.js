'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        static associate(models) {
            Book.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator',
            });

            // N+1 방지를 위해 주석 해제
            Book.hasMany(models.Review, {
                foreignKey: 'book_id',
                as: 'reviews'
            });
            Book.hasMany(models.CartItem, {
                foreignKey: 'book_id',
                as: 'cartItems'
            });
            Book.hasMany(models.OrderItem, {
                foreignKey: 'book_id',
                as: 'orderItems'
            });
            Book.belongsToMany(models.User, {
                through: models.Wishlist,
                foreignKey: 'book_id',
                otherKey: 'user_id',
                as: 'wishlistedBy'
            });
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
                type: DataTypes.JSON, // TEXT → JSON 변경
                allowNull: false,
                get() {
                    const value = this.getDataValue('authors');
                    return typeof value === 'string' ? JSON.parse(value) : value;
                },
                set(value) {
                    this.setDataValue('authors', JSON.stringify(value));
                }
            },
            categories: {
                type: DataTypes.JSON, // TEXT → JSON 변경
                allowNull: false,
                get() {
                    const value = this.getDataValue('categories');
                    return typeof value === 'string' ? JSON.parse(value) : value;
                },
                set(value) {
                    this.setDataValue('categories', JSON.stringify(value));
                }
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
            cover_image: { // 추가!
                type: DataTypes.STRING(500),
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
            underscored: true,
            timestamps: true,
        }
    );

    return Book;
};
