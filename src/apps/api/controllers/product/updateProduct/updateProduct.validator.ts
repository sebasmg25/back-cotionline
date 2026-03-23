import { body, param } from 'express-validator';

export const updateProductValidationRules = [
  param('id')
    .isUUID()
    .withMessage('El ID del producto debe ser un UUID válido.'),

  body().custom((value, { req }) => {
    const { name, amount, unitOfMeasurement, description } = req.body;
    if (!name && !amount && !unitOfMeasurement && !description) {
      throw new Error(
        'Al menos un campo debe ser proporcionado para la actualización.',
      );
    }
    return true;
  }),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),
  body('amount')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('La cantidad debe ser un número válido'),
  body('unitOfMeasurement')
    .optional()
    .notEmpty()
    .withMessage('La unidad no puede estar vacía'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder los 500 caracteres'),
];
