import { body } from 'express-validator';

export const createBusinessValidationRules = [
  // Validación de 'nit': debe existir y no estar vacío
  body('nit').notEmpty().withMessage('El campo nit es requerido.'),

  // Validación de 'name': debe existir y no estar vacío
  body('name').notEmpty().withMessage('El campo nombre es requerido.'),

  body('description')
    .notEmpty()
    .withMessage('El campo descripción es requerido.'),

  body('address').notEmpty().withMessage('El campo address es requerido.'),

  body('userId').notEmpty().withMessage('El campo usuario es requerido.'),
];
