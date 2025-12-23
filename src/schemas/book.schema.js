const Joi = require('joi');

exports.updateBookSchema = Joi.object({
    title: Joi.string().max(255),
    description: Joi.string().allow(null, ''),
    authors: Joi.array().items(Joi.string()),
    categories: Joi.array().items(Joi.string()),
    price: Joi.number().min(0),
    published_year: Joi.number().integer(),
    stock_quantity: Joi.number().integer().min(0),
    status: Joi.string().valid('ACTIVE', 'DELETED'),
}).min(1); // 최소 하나는 있어야 PATCH 의미 있음
