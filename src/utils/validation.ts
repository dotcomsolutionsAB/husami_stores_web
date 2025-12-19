import type Joi from 'joi';

export interface ValidationError {
  [key: string]: string;
}

export function validateFormData(
  data: Record<string, any>,
  schema: Joi.ObjectSchema<any>
): { errors: ValidationError | null; isValid: boolean } {
  const { error } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors: ValidationError = {};
    error.details.forEach((detail) => {
      errors[detail.path.join('.')] = detail.message;
    });
    return { errors, isValid: false };
  }

  return { errors: null, isValid: true };
}
