import { Router } from 'express';
import { CreateQuotationRequestController } from '../../controllers/quotationRequest/createQuotationRequest/createQuotationRequest.controller';

const router = Router();
const quotationRequestController = new CreateQuotationRequestController();

router.post(
  '/',
  quotationRequestController.registerQuotationRequest.bind(
    quotationRequestController
  )
);

router.patch(
  '/:id',
  quotationRequestController.updatedQuotationRequest.bind(
    quotationRequestController
  )
);

router.delete(
  '/:id',
  quotationRequestController.deleteQuotationRequest.bind(
    quotationRequestController
  )
);

export const quotationRequestRoutes = router;
