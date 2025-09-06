import { Router } from 'express';
import { CreateBusinessController } from '../../controllers/business/createBusiness/createBusiness.controller';
import { UpdateBusinessController } from '../../controllers/business/updateBusiness/updateBusiness.controller';
import { DeleteBusinessController } from '../../controllers/business/deleteBusiness/deleteBusiness.controller';
import { createBusinessValidationRules } from '../../controllers/business/createBusiness/createBusiness.validator';
import { updateBusinessValidationRules } from '../../controllers/business/updateBusiness/updateBusiness.validator';
import { RequestValidator } from '../../middlewares/validateRequest';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const createBusinessController = new CreateBusinessController();
const updateBusinessController = new UpdateBusinessController();
const deleteBusinessController = new DeleteBusinessController();

router.post(
  '/register',
  createBusinessValidationRules,
  (req: Request, res: Response, next: NextFunction) =>
    RequestValidator.handle(req, res, next),
  createBusinessController.registerBusiness.bind(createBusinessController)
);

router.patch(
  '/:id',
  updateBusinessValidationRules,
  (req: Request, res: Response, next: NextFunction) =>
    RequestValidator.handle(req, res, next),
  updateBusinessController.updateBusiness.bind(updateBusinessController)
);

router.delete(
  '/:id',
  deleteBusinessController.deleteBusiness.bind(deleteBusinessController)
);

export const businessRoutes = router;
