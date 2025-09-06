import { body, oneOf } from 'express-validator';

export const updateQuotationRequestValidationRules = oneOf(
  [
    body('responseDeadline').exists(),
    body('status').exists(),
    body('branch').exists(),
  ],
  { message: 'Se debe proporcionar al menos un campo a actualizar' }
);
