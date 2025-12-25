'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reviews', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'books', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            likes_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        // 인덱스 추가
        await queryInterface.addIndex('reviews', ['book_id'], {
            name: 'idx_reviews_book'
        });
        await queryInterface.addIndex('reviews', ['user_id'], {
            name: 'idx_reviews_user'
        });
        await queryInterface.addIndex('reviews', ['rating'], {
            name: 'idx_reviews_rating' // 추가! 통계/정렬용
        });
        await queryInterface.addIndex('reviews', ['created_at'], {
            name: 'idx_reviews_created_at' // 추가! 최신순 정렬용
        });

        // 한 사용자가 한 책에 하나의 리뷰만 작성 가능
        await queryInterface.addConstraint('reviews', {
            fields: ['user_id', 'book_id'],
            type: 'unique',
            name: 'unique_user_book_review'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('reviews');
    },
};