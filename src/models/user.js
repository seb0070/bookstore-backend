'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // associations는 나중에 연결
            // User.hasMany(models.Book, { foreignKey: 'created_by' });
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
                type: DataTypes.STRING(255),
                allowNull: false,
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
            underscored: true,   // ⭐ snake_case 핵심 옵션
            timestamps: true,   // created_at / updated_at 자동
        }
    );

    return User;
};
