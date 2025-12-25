const Joi = require('joi');

/**
 * 주문 생성 검증
 */
exports.createOrderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                book_id: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        'number.base': '도서 ID는 숫자여야 합니다.',
                        'number.positive': '도서 ID는 양수여야 합니다.',
                        'any.required': '도서 ID는 필수입니다.'
                    }),

                quantity: Joi.number()
                    .integer()
                    .min(1)
                    .max(100)
                    .required()
                    .messages({
                        'number.min': '수량은 최소 1개 이상이어야 합니다.',
                        'number.max': '수량은 최대 100개까지 가능합니다.',
                        'any.required': '수량은 필수입니다.'
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': '최소 1개 이상의 상품이 필요합니다.',
            'any.required': '주문 상품 목록은 필수입니다.'
        })
});

/**
 * 주문 상태 변경 검증 (ADMIN)
 */
exports.updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('PENDING', 'PAID', 'CANCELLED')
        .required()
        .messages({
            'any.only': '주문 상태는 PENDING, PAID, CANCELLED 중 하나여야 합니다.',
            'any.required': '주문 상태는 필수입니다.'
        })
});