import { body } from 'express-validator';

export const createQuotationRequestValidationRules = [
  // Validación de 'identification': debe existir y no estar vacío
  body('responseDeadline')
    .notEmpty()
    .withMessage('El campo tiempo máximo de respuesta es requerido.'),

  // Validación de 'name': debe existir y no estar vacío
  body('status').notEmpty().withMessage('El campo estado es requerido.'),

  // Validación de 'lastName': debe existir y no estar vacío
  body('branch').notEmpty().withMessage('El campo sede es requerido.'),

  // Validación de 'email':
  // 1. No debe estar vacío
  // 2. Debe ser un formato de email válido
  body('userId').notEmpty().withMessage('El campo email es requerido.'),
];
