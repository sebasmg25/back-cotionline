import { body } from 'express-validator';

export const resetPasswordValidationRules = [
  body('userId')
    .notEmpty()
    .withMessage('El ID de usuario es requerido.'),
  
  body('token')
    .notEmpty()
    .withMessage('El token de recuperación es requerido.'),

  body('newPassword')
    .isLength({ min: 8, max: 12 })
    .withMessage('La contraseña debe tener entre 8 y 12 caracteres.')
    .matches(/[A-Z]/)
    .withMessage('Debe contener al menos una letra mayúscula.')
    .matches(/[0-9]/)
    .withMessage('Debe contener al menos un número.')
    .matches(/[!@#$%^&*]/)
    .withMessage('Debe contener al menos un caracter especial.'),
];
