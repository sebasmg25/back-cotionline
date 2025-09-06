import { body, oneOf } from 'express-validator';

export const updateBusinessValidationRules = oneOf(
  [
    body('nit').exists(),
    body('name').exists(),
    body('description').exists(),
    body('address').exists(),
  ],
  { message: 'Se debe proporcionar al menos un campo a actualizar' }
);
