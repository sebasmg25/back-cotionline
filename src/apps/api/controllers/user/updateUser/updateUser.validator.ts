import { body } from 'express-validator';

export const updateUserValidationRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío.'),

  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido no puede estar vacío.'),

  body('department') // Agregamos validación opcional para departamento
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El departamento no puede estar vacío.'),

  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La ciudad no puede estar vacía.'),

  body('password')
    .optional()
    .isLength({ min: 8, max: 12 })
    .withMessage('La contraseña debe tener entre 8 y 12 caracteres.')
    .matches(/[A-Z]/)
    .withMessage('Debe contener al menos una letra mayúscula.')
    .matches(/[0-9]/)
    .withMessage('Debe contener al menos un número.')
    .matches(/[!@#$%^&*]/)
    .withMessage('Debe contener al menos un caracter especial.'),

  // Actualizamos la validación personalizada para incluir 'department'
  body().custom((value, { req }) => {
    const { name, lastName, department, city, password } = req.body;
    if (!name && !lastName && !department && !city && !password) {
      throw new Error(
        'Debes proporcionar al menos un campo para actualizar (nombre, apellido, departamento, ciudad o contraseña).',
      );
    }
    return true;
  }),
];
