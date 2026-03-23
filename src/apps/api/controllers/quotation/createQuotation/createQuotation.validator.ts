import { body, param } from 'express-validator';

export const createQuotationValidationRules = [
  param('quotationRequestId')
    .isUUID()
    .withMessage('El ID de la solicitud de cotización no es válido.'),

  body('responseDeadline')
    .notEmpty()
    .withMessage('La fecha de expiración es requerida.')
    .isISO8601()
    .withMessage('La fecha de expiración debe ser una fecha válida.'),

  body('price')
    .custom((value, { req }) => {
      if (req.body.status === 'DRAFT') {
        if (value !== undefined && typeof value !== 'number') {
           throw new Error('El precio debe ser un número.');
        }
        if (value !== undefined && value < 0) {
           throw new Error('El precio no puede ser negativo.');
        }
        return true;
      }

      if (value === undefined || value === null || value === '') {
        throw new Error('El precio es requerido');
      }
      if (!Number.isInteger(Number(value)) || Number(value) < 1) {
        throw new Error('El precio debe ser un número mayor a 0');
      }
      
      return true;
    }),
  body('deliveryTime')
    .notEmpty()
    .withMessage('La fecha de entrega es requerida')
    .isISO8601()
    .withMessage(
      'La fecha de entrega debe ser un formato de fecha válido (ISO8601)',
    ),

    body('description')
    .optional()
    .trim(),

  body('status')
    .notEmpty()
    .withMessage('El estado es requerido.')
    .isIn(['DRAFT', 'PENDING', 'ACCEPTED', 'EXPIRED'])
    .withMessage('El estado no es válido.'),
];
