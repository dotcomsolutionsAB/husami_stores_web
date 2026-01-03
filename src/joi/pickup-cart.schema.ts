import Joi from 'joi';

// Schema for creating a new pickup cart
export const pickupCartCreateSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  username: Joi.string().trim().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email address',
      'any.required': 'Email is required',
    }),
  mobile: Joi.string().trim().allow('').optional().messages({
    'string.base': 'Mobile must be a string',
  }),
  role: Joi.string().trim().required().messages({
    'string.empty': 'Role is required',
    'any.required': 'Role is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'Password confirmation is required',
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required',
  }),
});

// Schema for updating an existing pickup cart (password fields are optional)
export const pickupCartUpdateSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  username: Joi.string().trim().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email address',
      'any.required': 'Email is required',
    }),
  mobile: Joi.string().trim().allow('').optional().messages({
    'string.base': 'Mobile must be a string',
  }),
  role: Joi.string().trim().required().messages({
    'string.empty': 'Role is required',
    'any.required': 'Role is required',
  }),
  password: Joi.string().allow('').optional().min(6).messages({
    'string.min': 'Password must be at least 6 characters',
  }),
  password_confirmation: Joi.string().allow('').optional().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match',
  }),
});

export type PickupCartFormData = {
  name: string;
  email: string;
  mobile?: string;
  username: string;
  role: string;
  password?: string;
  password_confirmation?: string;
};
