// validations/authValidation.js
const Joi = require('joi');

// Register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

// Login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

// Change password validation
const changePasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation, changePasswordValidation };
