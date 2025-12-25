const Joi = require('joi');

/**
 * 도서 생성 검증
 */
exports.createBookSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.min': '제목은 최소 1자 이상이어야 합니다.',
            'string.max': '제목은 최대 200자까지 가능합니다.',
            'any.required': '제목은 필수입니다.'
        }),

    description: Joi.string()
        .max(2000)
        .optional()
        .messages({
            'string.max': '설명은 최대 2000자까지 가능합니다.'
        }),

    isbn: Joi.string()
        .pattern(/^(97[89])?\d{9}(\d|X)$/)
        .optional()
        .messages({
            'string.pattern.base': '올바른 ISBN 형식이 아닙니다.'
        }),

    authors: Joi.array()
        .items(Joi.string().min(1).max(100))
        .min(1)
        .required()
        .messages({
            'array.min': '최소 1명 이상의 작가가 필요합니다.',
            'any.required': '작가는 필수입니다.'
        }),

    categories: Joi.array()
        .items(Joi.string().min(1).max(50))
        .min(1)
        .required()
        .messages({
            'array.min': '최소 1개 이상의 카테고리가 필요합니다.',
            'any.required': '카테고리는 필수입니다.'
        }),

    publisher: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': '출판사는 최대 100자까지 가능합니다.'
        }),

    price: Joi.number()
        .min(0)
        .max(1000000)
        .required()
        .messages({
            'number.min': '가격은 0 이상이어야 합니다.',
            'number.max': '가격은 1,000,000 이하여야 합니다.',
            'any.required': '가격은 필수입니다.'
        }),

    published_year: Joi.number()
        .integer()
        .min(1000)
        .max(new Date().getFullYear())
        .required()
        .messages({
            'number.min': '출판 연도는 1000 이상이어야 합니다.',
            'number.max': `출판 연도는 ${new Date().getFullYear()} 이하여야 합니다.`,
            'any.required': '출판 연도는 필수입니다.'
        }),

    stock_quantity: Joi.number()
        .integer()
        .min(0)
        .optional()
        .default(0)
        .messages({
            'number.min': '재고는 0 이상이어야 합니다.'
        }),

    cover_image: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': '올바른 URL 형식이 아닙니다.'
        })
});

/**
 * 도서 수정 검증
 */
exports.updateBookSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .optional()
        .messages({
            'string.min': '제목은 최소 1자 이상이어야 합니다.',
            'string.max': '제목은 최대 200자까지 가능합니다.'
        }),

    description: Joi.string()
        .max(2000)
        .optional()
        .messages({
            'string.max': '설명은 최대 2000자까지 가능합니다.'
        }),

    isbn: Joi.string()
        .pattern(/^(97[89])?\d{9}(\d|X)$/)
        .optional()
        .messages({
            'string.pattern.base': '올바른 ISBN 형식이 아닙니다.'
        }),

    authors: Joi.array()
        .items(Joi.string().min(1).max(100))
        .min(1)
        .optional()
        .messages({
            'array.min': '최소 1명 이상의 작가가 필요합니다.'
        }),

    categories: Joi.array()
        .items(Joi.string().min(1).max(50))
        .min(1)
        .optional()
        .messages({
            'array.min': '최소 1개 이상의 카테고리가 필요합니다.'
        }),

    publisher: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': '출판사는 최대 100자까지 가능합니다.'
        }),

    price: Joi.number()
        .min(0)
        .max(1000000)
        .optional()
        .messages({
            'number.min': '가격은 0 이상이어야 합니다.',
            'number.max': '가격은 1,000,000 이하여야 합니다.'
        }),

    published_year: Joi.number()
        .integer()
        .min(1000)
        .max(new Date().getFullYear())
        .optional()
        .messages({
            'number.min': '출판 연도는 1000 이상이어야 합니다.',
            'number.max': `출판 연도는 ${new Date().getFullYear()} 이하여야 합니다.`
        }),

    stock_quantity: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.min': '재고는 0 이상이어야 합니다.'
        }),

    cover_image: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': '올바른 URL 형식이 아닙니다.'
        })
}).min(1).messages({
    'object.min': '최소 하나 이상의 필드가 필요합니다.'
});