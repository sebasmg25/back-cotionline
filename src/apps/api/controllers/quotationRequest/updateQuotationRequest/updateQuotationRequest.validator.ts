import { body, param } from 'express-validator';

export const updateQuotationRequestValidationRules = [
  param('id').isUUID().withMessage('ID de solicitud no válido'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío'),

  body('responseDeadline')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha inválido (ISO8601 requerido)'),

  body('branch')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La sede no puede estar vacía'),

  body('description')
    .optional()
    .trim(),

  body().custom((value, { req }) => {
    const { title, responseDeadline, branch, description } = req.body;
    if (!title && !responseDeadline && !branch && !description) {
      throw new Error(
        'Se debe proporcionar al menos un campo a actualizar (title, responseDeadline, branch o description)',
      );
    }
    return true;
  }),
];
