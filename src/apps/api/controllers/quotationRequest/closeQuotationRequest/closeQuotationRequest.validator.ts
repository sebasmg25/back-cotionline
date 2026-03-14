import { body } from 'express-validator';

export const closeQuotationRequestValidationRules = [
  body('selectedOfferId')
    .notEmpty()
    .withMessage('El ID de la cotización seleccionada es obligatorio.')
    .isUUID()
    .withMessage('El ID de la cotización debe ser un formato UUID válido.'),
];
