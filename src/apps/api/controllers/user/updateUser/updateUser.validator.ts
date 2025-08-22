import {body, param} from 'express-validator';

export const updateUserValidationRules = [
    param('id')
    .isUUID()
    .withMessage('El ID del usuario debe ser un formato válido.'),

    body('name')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacio.'),

    body('lastName')
    .optional()
    .notEmpty()
    .withMessage('El apellido no puede estar vacio.'),


    
];