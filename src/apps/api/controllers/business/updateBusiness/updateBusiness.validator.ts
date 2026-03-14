// updateBusiness.validator.ts
import { body, oneOf } from 'express-validator';

export const updateBusinessValidationRules = oneOf(
  [
    body('nit').exists(),
    body('name').exists(),
    body('description').exists(),
    body('address').exists(),
    // Agregamos una validación lógica: Si req.files existe, también es válido
    body('isFileUpload').custom((value, { req }) => {
      return !!(
        req.files &&
        (req.files['rut'] || req.files['chamberOfCommerce'])
      );
    }),
  ],
  {
    message:
      'Proporciona al menos un campo de texto o un archivo para actualizar.',
  },
);
