import { body } from 'express-validator';

export const loginUserValidationRules = [
  body('email')
    .trim() 
    .notEmpty()
    .withMessage('El campo de usuario es requerido')
    .isEmail()
    .withMessage('Formato de correo inválido')
    .normalizeEmail(), 

  body('password').notEmpty().withMessage('La contraseña es requerida'),
  
];
