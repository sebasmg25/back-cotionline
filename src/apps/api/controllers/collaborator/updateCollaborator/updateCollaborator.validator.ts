import { body, param } from 'express-validator';

export const updateCollaboratorValidationRules = [
  param('id')
    .isUUID()
    .withMessage('El ID del colaborador debe ser un formato válido.'),

  body('email')
    .notEmpty()
    .withMessage('El campo email es requerido.')
    .isEmail()
    .withMessage('El formato de correo es inválido.'),
];
