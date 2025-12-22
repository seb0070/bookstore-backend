'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('books', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            isbn: {
                type: Sequelize.STRING(50),
                allowNull: true,
                unique: true,
            },

            authors: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            categories: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            publisher: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            published_year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },

            stock_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            status: {
                type: Sequelize.ENUM('ACTIVE', 'DELETED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },

            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
                ),
            },
        });

        // 검색/정렬 성능 인덱스
        await queryInterface.addIndex('books', ['title'], {
            name: 'idx_books_title',
        });

        await queryInterface.addIndex('books', ['created_by'], {
            name: 'idx_books_created_by',
        });

        await queryInterface.addIndex('books', ['status'], {
            name: 'idx_books_status',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('books');
    },
};
