'use strict';

module.exports = {
    async up(queryInterface) {
        const reviews = [];

        // 50개의 리뷰 생성
        for (let i = 0; i < 50; i++) {
            const userId = (i % 29) + 2; // user1~user29 (admin 제외)
            const bookId = (i * 2) % 100 + 1; // 1~100 사이 책
            const ratings = [1, 2, 3, 4, 5];
            const contents = [
                '정말 훌륭한 책입니다. 강력 추천합니다!',
                '기대 이상이었어요. 다시 읽고 싶네요.',
                '내용이 유익하고 재미있습니다.',
                '평범했어요. 그냥 그랬습니다.',
                '별로였습니다. 실망스러웠어요.',
                '감동적이었습니다. 눈물이 났어요.',
                '많은 생각을 하게 만드는 책이네요.',
                '시간 가는 줄 모르고 읽었습니다.',
                '작가의 문체가 마음에 듭니다.',
                '주변에 추천하고 싶어요.'
            ];

            reviews.push({
                user_id: userId,
                book_id: bookId,
                rating: ratings[i % 5],
                content: contents[i % contents.length] + ` (리뷰 ${i + 1})`,
                likes_count: i % 20,
                created_at: new Date(Date.now() - (i * 86400000)), // i일 전
                updated_at: new Date(Date.now() - (i * 86400000)),
            });
        }

        await queryInterface.bulkInsert('reviews', reviews);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('reviews', null, {});
    },
};