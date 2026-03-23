import { body } from 'express-validator';

export const createUserValidationRules = [
  body('identification')
    .trim()
    .notEmpty()
    .withMessage('La identificación es requerida.'),
  body('name').trim().notEmpty().withMessage('El nombre es requerido.'),
  body('lastName').trim().notEmpty().withMessage('El apellido es requerido.'),
  body('email')
    .isEmail()
    .withMessage('El formato de correo es inválido.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8, max: 12 })
    .withMessage('La contraseña debe tener entre 8 y 12 caracteres.')
    .matches(/[A-Z]/)
    .withMessage('Debe contener al menos una letra mayúscula.')
    .matches(/[0-9]/)
    .withMessage('Debe contener al menos un número.')
    .matches(/[!@#$%^&*]/)
    .withMessage('Debe contener al menos un caracter especial.'),

  body('department') 
    .trim()
    .notEmpty()
    .withMessage('El campo departamento es requerido.'),

  body('city').trim().notEmpty().withMessage('El campo ciudad es requerido.'),
];
