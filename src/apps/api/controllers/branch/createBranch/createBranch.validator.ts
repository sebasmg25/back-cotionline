import { body } from "express-validator";

export const createBranchValidationRules = [
    body('name')
     .notEmpty()
     .withMessage('El nombre de la sede es requerido.')
     .isLength({min: 3})
     .withMessage('El nombre debe tener al menos 3 carácteres.'),


    body('address')
     .notEmpty()
     .withMessage('La dirección es requerida'),

    body('city')
     .notEmpty()
     .withMessage('La ciudad es requerida'),

    body('business')
     .notEmpty()
     .withMessage('El negocio al que pertenece la sede, es requerido'),    
];