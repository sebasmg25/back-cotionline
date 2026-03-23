import { Router, Request, Response } from 'express';
import { uploadBusinessDocs } from '../../middlewares/multer';

import { TypeORMBusinessRepository } from '../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';

import { RegisterBusinessUseCase } from '../../../../contexts/business/useCases/registerBusiness.useCase';
import { UpdateBusinessUseCase } from '../../../../contexts/business/useCases/updateBusiness.useCase';
import { GetBusinessUseCase } from '../../../../contexts/business/useCases/getBusiness.useCase';
import { DeleteBusinessUseCase } from '../../../../contexts/business/useCases/deleteBusiness.useCase';
import { VerifyBusinessUseCase } from '../../../../contexts/business/useCases/verifyBusiness.useCase';

import { CreateBusinessController } from '../../controllers/business/createBusiness/createBusiness.controller';
import { UpdateBusinessController } from '../../controllers/business/updateBusiness/updateBusiness.controller';
import { GetBusinessController } from '../../controllers/business/getBusiness/getBusiness.controller';
import { DeleteBusinessController } from '../../controllers/business/deleteBusiness/deleteBusiness.controller';
import { VerifyBusinessController } from '../../controllers/business/verifyBusiness/verifyBusiness.controller';

import { createBusinessValidationRules } from '../../controllers/business/createBusiness/createBusiness.validator';
import { updateBusinessValidationRules } from '../../controllers/business/updateBusiness/updateBusiness.validator';
import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier'; // <-- Agregado AuthRequest
import { BusinessStatusValidator } from '../../middlewares/businessStatus';

const router = Router();
const businessRepository = new TypeORMBusinessRepository();


const createBusinessUseCase = new RegisterBusinessUseCase(businessRepository);
const updateBusinessUseCase = new UpdateBusinessUseCase(businessRepository);
const getBusinessUseCase = new GetBusinessUseCase(businessRepository);
const deleteBusinessUseCase = new DeleteBusinessUseCase(businessRepository);
const verifyBusinessUseCase = new VerifyBusinessUseCase(businessRepository);


const createBusinessController = new CreateBusinessController(
  createBusinessUseCase,
);
const updateBusinessController = new UpdateBusinessController(
  updateBusinessUseCase,
);
const getBusinessController = new GetBusinessController(getBusinessUseCase);
const deleteBusinessController = new DeleteBusinessController(
  deleteBusinessUseCase,
);
const verifyBusinessController = new VerifyBusinessController(
  verifyBusinessUseCase,
);

router.post(
  '/register',
  JwtVerifier.handler,
  uploadBusinessDocs.fields([
    { name: 'rut', maxCount: 1 },
    { name: 'chamberOfCommerce', maxCount: 1 },
  ]),
  createBusinessValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) =>
    createBusinessController.handle(req as AuthRequest, res),
);

router.patch(
  '/:id/verify',
  JwtVerifier.handler,
  (req: Request, res: Response) =>
    verifyBusinessController.handle(req as AuthRequest, res),
);

router.patch(
  '/:id',
  JwtVerifier.handler,
  // BusinessStatusValidator.handler,
  uploadBusinessDocs.fields([
    { name: 'rut', maxCount: 1 },
    { name: 'chamberOfCommerce', maxCount: 1 },
  ]),
  updateBusinessValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) =>
    updateBusinessController.handle(req as AuthRequest, res),
);

router.get('/my-business', JwtVerifier.handler, (req: Request, res: Response) =>
  getBusinessController.handle(req as AuthRequest, res),
);

router.delete(
  '/:id',
  JwtVerifier.handler,
  // BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    deleteBusinessController.handle(req as AuthRequest, res),
);

export const businessRoutes = router;
