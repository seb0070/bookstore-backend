const Joi = require('joi');

exports.createBookSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow('', null),
    authors: Joi.array().items(Joi.string()).min(1).required(),
    categories: Joi.array().items(Joi.string()).min(1).required(),
    price: Joi.number().positive().required(),
    published_year: Joi.number().integer().min(1900).max(2100).required(),
    stock_quantity: Joi.number().integer().min(0).default(0),
});