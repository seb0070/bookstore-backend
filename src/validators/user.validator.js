const Joi = require('joi');

/**
 * 내 정보 수정 검증
 */
exports.updateMeSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': '이름은 최소 2자 이상이어야 합니다.',
            'string.max': '이름은 최대 50자까지 가능합니다.'
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .optional()
        .messages({
            'string.min': '비밀번호는 최소 8자 이상이어야 합니다.',
            'string.max': '비밀번호는 최대 50자까지 가능합니다.',
            'string.pattern.base': '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.'
        }),

    birth_date: Joi.date()
        .optional()
        .messages({
            'date.base': '올바른 날짜 형식이 아닙니다.'
        }),

    gender: Joi.string()
        .valid('M', 'F', 'OTHER')
        .optional()
        .messages({
            'any.only': '성별은 M, F, OTHER 중 하나여야 합니다.'
        }),

    address: Joi.string()
        .max(200)
        .optional()
        .messages({
            'string.max': '주소는 최대 200자까지 가능합니다.'
        }),

    phone_number: Joi.string()
        .pattern(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/)
        .optional()
        .messages({
            'string.pattern.base': '올바른 전화번호 형식이 아닙니다.'
        })
}).min(1).messages({
    'object.min': '최소 하나 이상의 필드가 필요합니다.'
});

/**
 * 사용자 상태 변경 검증 (ADMIN)
 */
exports.updateUserStatusSchema = Joi.object({
    status: Joi.string()
        .valid('ACTIVE', 'BLOCKED', 'DELETED')
        .required()
        .messages({
            'any.only': '상태는 ACTIVE, BLOCKED, DELETED 중 하나여야 합니다.',
            'any.required': '상태는 필수입니다.'
        })
});