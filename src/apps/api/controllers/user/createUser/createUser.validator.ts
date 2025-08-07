import { body } from 'express-validator';

export const createUserValidationRules = [
  // Validación de 'identification': debe existir y no estar vacío
  body('identification')
    .notEmpty()
    .withMessage('El campo identificación es requerido.'),

  // Validación de 'name': debe existir y no estar vacío
  body('name').notEmpty().withMessage('El campo nombre es requerido.'),

  // Validación de 'lastName': debe existir y no estar vacío
  body('lastName').notEmpty().withMessage('El campo apellido es requerido.'),

  // Validación de 'email':
  // 1. No debe estar vacío
  // 2. Debe ser un formato de email válido
  body('email')
    .notEmpty()
    .withMessage('El campo email es requerido.')
    .isEmail()
    .withMessage('El formato de correo es inválido.'),

  // Validación de 'password':
  // 1. No debe estar vacío
  // 2. No debe superar los 12 caracteres
  // 3. Debe contener al menos una letra mayúscula
  // 4. Debe contener al menos un número
  // 5. Debe contener al menos un caracter especial
  body('password')
    .notEmpty()
    .withMessage('El campo contraseña es requerido.')
    .isLength({ max: 12 })
    .withMessage('La contraseña supera el máximo de 12 caracteres permitidos.')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula.')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número.')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
    .withMessage('La contraseña debe contener al menos un caracter especial.'),

  // Validación de 'city': debe existir y no estar vacío
  body('city').notEmpty().withMessage('El campo ciudad es requerido.'),
];
