import { Router } from 'express';
import { CreateQuotationRequestController } from '../../controllers/quotationRequest/createQuotationRequest/createQuotationRequest.controller';
import { UpdateQuotationRequestController } from '../../controllers/quotationRequest/updateQuotationRequest/updateQuotationRequest.controller';
import { DeleteQuotationRequestController } from '../../controllers/quotationRequest/deleteQuotationRequest/deleteQuotationRequest.controller';
import { createQuotationRequestValidationRules } from '../../controllers/quotationRequest/createQuotationRequest/createQuotationRequest.validator';
import { updateQuotationRequestValidationRules } from '../../controllers/quotationRequest/updateQuotationRequest/updateQuotationRequest.validator';
import { RequestValidator } from '../../middlewares/validateRequest';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const createQuotationRequestController = new CreateQuotationRequestController();
const updateQuotationRequestController = new UpdateQuotationRequestController();
const deleteQuotationRequestController = new DeleteQuotationRequestController();

router.post(
  '/',
  createQuotationRequestValidationRules,
  (req: Request, res: Response, next: NextFunction) =>
    RequestValidator.handle(req, res, next),
  createQuotationRequestController.registerQuotationRequest.bind(
    createQuotationRequestController
  )
);

router.patch(
  '/:id',
  updateQuotationRequestValidationRules,
  (req: Request, res: Response, next: NextFunction) =>
    RequestValidator.handle(req, res, next),
  updateQuotationRequestController.updatedQuotationRequest.bind(
    updateQuotationRequestController
  )
);

router.delete(
  '/:id',
  deleteQuotationRequestController.deleteQuotationRequest.bind(
    deleteQuotationRequestController
  )
);

export const quotationRequestRoutes = router;
