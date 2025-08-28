import { Router } from 'express';
import { CreateBusinessController } from '../../controllers/business/createBusiness/createBusiness.controller';
import { createBusinessValidationRules } from '../../controllers/business/createBusiness/createBusiness.validator';
import { RequestValidator } from '../../middlewares/validateRequest';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const businessController = new CreateBusinessController();

router.post(
  '/register',
  createBusinessValidationRules,
  RequestValidator.handle,
  businessController.registerBusiness.bind(businessController)
);

router.patch(
  '/:id',
  businessController.updateBusiness.bind(businessController)
);

router.delete(
  '/:id',
  businessController.deleteBusiness.bind(businessController)
);

export const businessRoutes = router;
