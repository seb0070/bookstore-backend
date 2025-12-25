const Joi = require('joi');

exports.updateUserStatusSchema = Joi.object({
    status: Joi.string()
        .valid('ACTIVE', 'BLOCKED', 'DELETED')
        .required(),
});
