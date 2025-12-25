const Joi = require('joi');

/**
 * 회원가입 검증
 */
exports.signupSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': '유효한 이메일 형식이 아닙니다.',
            'any.required': '이메일은 필수입니다.'
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': '비밀번호는 최소 8자 이상이어야 합니다.',
            'string.max': '비밀번호는 최대 50자까지 가능합니다.',
            'string.pattern.base': '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.',
            'any.required': '비밀번호는 필수입니다.'
        }),

    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': '이름은 최소 2자 이상이어야 합니다.',
            'string.max': '이름은 최대 50자까지 가능합니다.',
            'any.required': '이름은 필수입니다.'
        }),

    birth_date: Joi.date()
        .optional()
        .messages({
            'date.base': '올바른 날짜 형식이 아닙니다.'
        }),

    gender: Joi.string()
        .valid('MALE', 'FEMALE', 'OTHER')
        .optional()
        .messages({
            'any.only': '성별은 MALE, FEMALE, OTHER 중 하나여야 합니다.'
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
            'string.pattern.base': '올바른 전화번호 형식이 아닙니다. (010-1234-5678)'
        })
});

/**
 * 로그인 검증
 */
exports.loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': '유효한 이메일 형식이 아닙니다.',
            'any.required': '이메일은 필수입니다.'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': '비밀번호는 필수입니다.'
        })
});

/**
 * 토큰 갱신 검증
 */
exports.refreshSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': '리프레시 토큰은 필수입니다.'
        })
});