const Joi = require("joi");

exports.signupValidation = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Name should be a type of text",
    "string.min": "Name must be at least 3 characters long",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("buyer", "seller").required().messages({
    "any.only": "Role must be either 'buyer' or 'seller'",
    "any.required": "Role is required",
  }),
});

exports.loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});