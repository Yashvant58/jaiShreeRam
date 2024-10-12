const Joi = require('joi');

// Signup validation schema
const signupValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email:Joi.string().email().required(),
  fullName: Joi.string().min(3).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  age: Joi.number().integer().min(18).required(),  // Age must be at least 18
  address: Joi.string().required(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
  profession: Joi.string().required(),
  hasInsurance: Joi.string().valid("true", "false").default("false").optional(),

  insuranceType: Joi.string().allow('').optional(),

  insuranceCompany: Joi.string().allow('').optional()
});

// Login validation schema
const loginValidation = Joi.object({
  user_mail: Joi.string().email().required(),
});

module.exports = {
  signupValidation,
  loginValidation
};
