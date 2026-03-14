import { body, param } from 'express-validator';

export const updateQuotationValidationRules = [
  param('id')
    .isUUID()
    .withMessage('El ID de la cotización debe ser un UUID válido.'),

  // Validar que al menos un campo venga en el body
  body().custom((value, { req }) => {
    const { responseDeadline, price, deliveryTime, description, status } = req.body;
    if (!responseDeadline && !price && !deliveryTime && !description && !status) {
      throw new Error(
        'Al menos un campo debe ser proporcionado para la actualización.',
      );
    }
    return true;
  }),

  body('responseDeadline').optional().isISO8601().withMessage('Fecha inválida'),
  body('price')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El precio debe ser un número entero positivo'),
  body('deliveryTime')
    .optional()
    .isISO8601()
    .withMessage('Fecha de entrega inválida'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PENDING', 'ACCEPTED', 'EXPIRED'])
    .withMessage('El estado no es válido.'),

];
