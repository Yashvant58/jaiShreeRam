// validations/cityValidation.js
const Joi = require('joi');

// City validation schema
const cityValidationSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.empty': 'City name is required',
    'string.min': 'City name must be at least 2 characters long'
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country is required',
  })
});

module.exports = {
  cityValidationSchema
};
