import { body } from 'express-validator';

export const createQuotationRequestValidationRules = [
  body('title').trim().notEmpty().withMessage('El titulo es requerido.'),

  body('responseDeadline')
    .notEmpty()
    .withMessage('La fecha límite de respuesta es requerida.')
    .isISO8601()
    .withMessage('La fecha debe ser un formato válido (ISO8601).'),

  body('branch')
    .trim()
    .notEmpty()
    .withMessage('La sede (branch) es requerida.'),
    
  body('description')
    .optional()
    .trim(),
];
