const Joi = require('joi');

/**
 * 위시리스트에 도서 추가 검증
 */
exports.addToWishlistSchema = Joi.object({
    book_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': '도서 ID는 숫자여야 합니다.',
            'number.positive': '도서 ID는 양수여야 합니다.',
            'any.required': '도서 ID는 필수입니다.'
        })
});