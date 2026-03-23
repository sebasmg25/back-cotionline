import { Router, Request, Response } from 'express';

import { TypeORMQuotationRequestRepository } from '../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';
import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';
import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { TypeORMQuotationRepository } from '../../../../contexts/quotation/infraestructure/persistance/typeorm/typeOrmQuotationRepository';
import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';
import { TypeORMBranchRepository } from '../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository';
import { TypeORMBusinessRepository } from '../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';

import { RegisterQuotationRequestUseCase } from '../../../../contexts/quotationRequest/useCases/registerQuotationRequest.useCase';
import { UpdateQuotationRequestUseCase } from '../../../../contexts/quotationRequest/useCases/updateQuotationRequest.useCase';
import { DeleteQuotationRequestUseCase } from '../../../../contexts/quotationRequest/useCases/deleteQuotationRequest.useCase';
import { GetQuotationRequestUseCase } from '../../../../contexts/quotationRequest/useCases/getQuotationRequest.useCase';
import { GetAllQuotationRequestsByUserIdUseCase } from '../../../../contexts/quotationRequest/useCases/getAllQuotationRequestsByUserId.useCase';
import { SearchQuotationRequestsByTitleUseCase } from '../../../../contexts/quotationRequest/useCases/searchQuotationRequestsByTitle.useCase';
import { CloseQuotationRequestUseCase } from '../../../../contexts/quotationRequest/useCases/closeQuotationRequest.useCase';
import { SendNotificationUseCase } from '../../../../contexts/notification/useCases/sendNotification.useCase';
import { GetPublicQuotationRequestsUseCase } from '../../../../contexts/quotationRequest/useCases/getPublicQuotationRequests.useCase';

import { CreateQuotationRequestController } from '../../controllers/quotationRequest/createQuotationRequest/createQuotationRequest.controller';
import { UpdateQuotationRequestController } from '../../controllers/quotationRequest/updateQuotationRequest/updateQuotationRequest.controller';
import { DeleteQuotationRequestController } from '../../controllers/quotationRequest/deleteQuotationRequest/deleteQuotationRequest.controller';
import { GetQuotationRequestController } from '../../controllers/quotationRequest/getQuotationRequest/getQuotationRequest.controller';
import { GetAllQuotationRequestsByUserIdController } from '../../controllers/quotationRequest/getAllQuotationRequestsByUserId/getAllQuotationRequestsByUserId.controller';
import { SearchQuotationRequestsByTitleController } from '../../controllers/quotationRequest/searchQuotationRequestsByTitle/searchQuotationRequestsByTitle.controller';
import { CloseQuotationRequestController } from '../../controllers/quotationRequest/closeQuotationRequest/closeQuotationRequest.controller';
import { GetPublicQuotationRequestsController } from '../../controllers/quotationRequest/getPublicQuotationRequests/getPublicQuotationRequests.controller';

import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { BusinessStatusValidator } from '../../middlewares/businessStatus';
import { createQuotationRequestValidationRules } from '../../controllers/quotationRequest/createQuotationRequest/createQuotationRequest.validator';
import { updateQuotationRequestValidationRules } from '../../controllers/quotationRequest/updateQuotationRequest/updateQuotationRequest.validator';
import { closeQuotationRequestValidationRules } from '../../controllers/quotationRequest/closeQuotationRequest/closeQuotationRequest.validator';

const router = Router();


const quotationRequestRepo = new TypeORMQuotationRequestRepository();
const userRepo = new TypeORMUserRepository();
const planRepo = new TypeORMPlanRepository();
const quotationRepo = new TypeORMQuotationRepository();
const notificationRepository = new TypeORMNotificationRepository();
const branchRepo = new TypeORMBranchRepository();
const businessRepo = new TypeORMBusinessRepository();

const sendNotificationUseCase = new SendNotificationUseCase(
  notificationRepository,
);
const registerUseCase = new RegisterQuotationRequestUseCase(
  quotationRequestRepo,
  userRepo,
  planRepo,
);
const updateUseCase = new UpdateQuotationRequestUseCase(quotationRequestRepo);
const deleteUseCase = new DeleteQuotationRequestUseCase(quotationRequestRepo);
const getUseCase = new GetQuotationRequestUseCase(
  quotationRequestRepo,
  quotationRepo,
  branchRepo,
  businessRepo,
  userRepo,
);
const getAllByUserIdUseCase = new GetAllQuotationRequestsByUserIdUseCase(
  quotationRequestRepo,
);
const searchUseCase = new SearchQuotationRequestsByTitleUseCase(
  quotationRequestRepo,
);
const closeUseCase = new CloseQuotationRequestUseCase(
  quotationRequestRepo,
  quotationRepo,
  sendNotificationUseCase,
);
const getPublicUseCase = new GetPublicQuotationRequestsUseCase(
  quotationRequestRepo,
  branchRepo,
  businessRepo,
  userRepo,
);

const createCtrl = new CreateQuotationRequestController(registerUseCase);
const updateCtrl = new UpdateQuotationRequestController(updateUseCase);
const deleteCtrl = new DeleteQuotationRequestController(deleteUseCase);
const getCtrl = new GetQuotationRequestController(getUseCase);
const getAllByUserIdCtrl = new GetAllQuotationRequestsByUserIdController(
  getAllByUserIdUseCase,
);
const searchCtrl = new SearchQuotationRequestsByTitleController(searchUseCase);
const closeCtrl = new CloseQuotationRequestController(closeUseCase);
const getPublicCtrl = new GetPublicQuotationRequestsController(
  getPublicUseCase,
);

router.get(
  '/public',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    getPublicCtrl.handle(req as AuthRequest, res),
);

router.get(
  '/search',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => searchCtrl.handle(req as AuthRequest, res),
);

router.get(
  '/my-history',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, 
  (req: Request, res: Response) =>
    getAllByUserIdCtrl.handle(req as AuthRequest, res),
);

router.get(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => getCtrl.handle(req as AuthRequest, res),
);

router.post(
  '/register',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  createQuotationRequestValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => createCtrl.handle(req as AuthRequest, res),
);

router.patch(
  '/:id/close',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  closeQuotationRequestValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => closeCtrl.handle(req as AuthRequest, res),
);

router.patch(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  updateQuotationRequestValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => updateCtrl.handle(req as AuthRequest, res),
);

router.delete(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => deleteCtrl.handle(req as AuthRequest, res),
);

export const quotationRequestRoutes = router;
