const Joi = require('joi');

// Banner validation schema
const bannerValidationSchema = Joi.object({
    bannerType: Joi.string()
        // .uri() // If provided, must be a valid URI
        .allow(null) // Allow null as a valid value
        .messages({
            'string.base': 'Spotlight banner must be a string.',
        }),


});

// Export the validation schema
module.exports = {
    bannerValidationSchema
};
