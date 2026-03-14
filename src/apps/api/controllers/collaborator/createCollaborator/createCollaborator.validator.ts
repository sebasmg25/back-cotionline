import { body } from 'express-validator';

export const createCollaboratorValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El campo email es requerido.')
    .isEmail()
    .withMessage('El formato de correo es inválido.')
    .normalizeEmail(),
];
