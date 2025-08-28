import { body, param } from "express-validator";

export const UpdateBranchValidationRules = [
    param('id')
     .isUUID()
     .withMessage('El ID de la sede debe ser un UUID válido.'),

    body('name')
     .optional()
     .notEmpty()
     .withMessage('El nombre no puede estar vacio')
     .isLength({min: 3})
     .withMessage('El nombre debe tener al menos 3 caracteres.'),

    body('address')
     .optional()
     .notEmpty()
     .withMessage('La dirección no puede estar vacia.'),

    body('city')
     .optional()
     .notEmpty()
     .withMessage('La ciudad no puede estar vacia.')

]