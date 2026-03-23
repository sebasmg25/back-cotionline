import { body, param } from 'express-validator';

export const createProductValidationRules = [
  param('quotationRequestId')
    .isUUID()
    .withMessage('El ID de la solicitud de cotización no es válido.'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es requerido.')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres.'),

  body('amount')
    .notEmpty()
    .withMessage('La cantidad es requerida')
    .isFloat({ min: 0.1 })
    .withMessage('La cantidad debe ser un número mayor a 0'),

  body('unitOfMeasurement')
    .notEmpty()
    .withMessage('La unidad de medida es requerida'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder los 500 caracteres'),
];
