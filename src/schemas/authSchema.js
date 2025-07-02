import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPwdSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token is required',
    'string.empty': 'Token must not be empty',
  }),
  password: Joi.string().min(6).max(64).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password must not be empty',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 64 characters long',
    'any.required': 'Password is required',
  }),
});

export { registerSchema, loginSchema, emailSchema, resetPwdSchema };
