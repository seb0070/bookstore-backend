'use strict';

module.exports = {
    async up(queryInterface) {
        const comments = [];

        const commentTexts = [
            '좋은 리뷰 감사합니다!',
            '저도 같은 생각입니다.',
            '동의하기 어렵네요.',
            '다른 관점도 있을 것 같아요.',
            '자세한 리뷰 감사드려요.',
            '참고가 되었습니다.',
            '공감합니다!',
            '저도 이 책 좋아해요.',
            '추천 감사합니다.',
            '한번 읽어봐야겠어요.'
        ];

        // 30개의 댓글 생성
        for (let i = 0; i < 30; i++) {
            const userId = (i % 29) + 2;
            const reviewId = (i % 50) + 1;

            comments.push({
                review_id: reviewId,
                user_id: userId,
                content: commentTexts[i % commentTexts.length] + ` (댓글 ${i + 1})`,
                likes_count: i % 10,
                created_at: new Date(Date.now() - (i * 43200000)), // i*12시간 전
                updated_at: new Date(Date.now() - (i * 43200000)),
            });
        }

        await queryInterface.bulkInsert('comments', comments);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('comments', null, {});
    },
};
