'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const books = [];

        for (let i = 1; i <= 50; i++) {
            books.push({
                title: `테스트 도서 ${i}`,
                description: `테스트 도서 ${i}에 대한 설명입니다.`,
                authors: [`저자${i}`],
                categories: ['TEST'],
                price: 10000 + i * 500,
                published_year: 2000 + (i % 20),
                status: 'ACTIVE',
                stock_quantity: 100,
                created_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert('books', books);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('books', null, {});
    },
};
