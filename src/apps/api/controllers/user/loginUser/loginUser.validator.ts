import { body } from 'express-validator';

export const loginUserValidationRules = [
  body('email')
    .trim() // Limpia espacios en blanco
    .notEmpty()
    .withMessage('El campo de usuario es requerido')
    .isEmail()
    .withMessage('Formato de correo inválido')
    .normalizeEmail(), // Convierte a minúsculas y estandariza

  body('password').notEmpty().withMessage('La contraseña es requerida'),
  // Nota: Aquí no validamos longitud ni mayúsculas, eso es para el Registro.
  // En el Login solo verificamos que no esté vacío para no dar pistas.
];
