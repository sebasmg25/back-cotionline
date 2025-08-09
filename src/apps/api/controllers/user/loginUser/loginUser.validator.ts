import {body} from 'express-validator'

export const  loginUserValidationRules = [
    body('email')
    .notEmpty()
    .withMessage('El campo de usuario es requerido')
    .isEmail()
    .withMessage('Formato de correo inválido'),

    body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    

]