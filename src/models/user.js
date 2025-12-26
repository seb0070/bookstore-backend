'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // N+1 방지를 위해 모든 관계 정의
            User.hasMany(models.Book, {
                foreignKey: 'created_by',
                as: 'createdBooks'
            });
            User.hasMany(models.Review, {
                foreignKey: 'user_id',
                as: 'reviews'
            });
            User.hasMany(models.Comment, {
                foreignKey: 'user_id',
                as: 'comments'
            });
            User.hasMany(models.Order, {
                foreignKey: 'user_id',
                as: 'orders'
            });
            User.hasOne(models.Cart, {
                foreignKey: 'user_id',
                as: 'cart'
            });
            User.hasMany(models.UserRefreshToken, {
                foreignKey: 'user_id',
                as: 'refreshTokens'
            });
            User.belongsToMany(models.Book, {
                through: 'Wishlist',  // 문자열!
                foreignKey: 'user_id',
                otherKey: 'book_id',
                as: 'wishlist'
            });
            User.belongsToMany(models.Review, {
                through: 'ReviewLike',  // 문자열!
                foreignKey: 'user_id',
                otherKey: 'review_id',
                as: 'likedReviews'
            });
            User.belongsToMany(models.Comment, {
                through: 'CommentLike',  // 문자열!
                foreignKey: 'user_id',
                otherKey: 'comment_id',
                as: 'likedComments'
            });

        }
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: true,  // false → true로 변경
                field: 'password_hash'
            },
            provider: {
                type: DataTypes.ENUM('LOCAL', 'GOOGLE', 'FIREBASE'),
                allowNull: false,
                defaultValue: 'LOCAL'
            },
            provider_id: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            birth_date: {
                type: DataTypes.DATEONLY,
            },
            gender: {
                type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
            },
            phone_number: {
                type: DataTypes.STRING(20),
            },
            address: {
                type: DataTypes.STRING(255),
            },
            role: {
                type: DataTypes.ENUM('USER', 'ADMIN'),
                allowNull: false,
                defaultValue: 'USER',
            },
            status: {
                type: DataTypes.ENUM('ACTIVE', 'BLOCKED', 'DELETED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            deleted_at: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            underscored: true,
            timestamps: true,
        }
    );

    return User;
};
