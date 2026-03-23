import { body } from 'express-validator';

export const forgotPasswordValidationRules = [
  body('email')
    .isEmail()
    .withMessage('El formato de correo es inválido.')
    .normalizeEmail()
    .notEmpty()
    .withMessage('El correo electrónico es requerido.'),
];
