
import { body } from 'express-validator';

export const createBusinessValidationRules = [
  body('nit').notEmpty().withMessage('El campo nit es requerido.'),
  body('name').notEmpty().withMessage('El campo nombre es requerido.'),
  body('description')
    .notEmpty()
    .withMessage('El campo descripción es requerido.'),
  body('address').notEmpty().withMessage('El campo address es requerido.'),

];
