
const Joi = require('joi');

const categoryValidation = Joi.object({
    category: Joi.string().required(),
    name: Joi.string().required().trim(),
    designation: Joi.string().required(),
    address: Joi.string().required(),
    category_id: Joi.string().required(),
    url: Joi.string().optional().uri(), // Must be a valid URL if provided
    whatsapp_number: Joi.string().pattern(/^\d{10}$/).required(), // Must be a valid WhatsApp number
    city: Joi.string().min(2).required().messages({
    'string.empty': 'City name is required',
    'string.min': 'City name must be at least 2 characters long'
  }),
});
const getSubCategories=Joi.object({
    categoryID:Joi.string().required(),
    page:Joi.string().required(),
     limit:Joi.string().required() , 
    search:Joi.string(),

})

module.exports = { categoryValidation,getSubCategories };
