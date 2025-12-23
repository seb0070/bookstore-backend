const Joi = require('joi');

exports.createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
});

exports.updateMeSchema = Joi.object({
    name: Joi.string().min(2).max(30),
    password: Joi.string().min(8),
});
