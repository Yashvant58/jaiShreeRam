const Joi = require('joi');

// Category validation schema
const categoryValidation = Joi.object({
  category_name: Joi.string().min(3).max(100).required(),  // Category name must be between 3 and 100 characters
  category_screen: Joi.string().min(3).max(100).valid("Home","Others").required(),  // Category name must be between 3 and 100 characters
 
});



module.exports = {
  categoryValidation
};
