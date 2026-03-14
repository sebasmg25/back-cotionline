import { Router, Request, Response } from 'express';

// Infraestructura (Repositorios)
import { TypeORMQuotationRepository } from '../../../../contexts/quotation/infraestructure/persistance/typeorm/typeOrmQuotationRepository';
import { TypeORMQuotationRequestRepository } from '../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';
import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';
import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';
import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';

// Casos de Uso
import { CreateQuotationUseCase } from '../../../../contexts/quotation/useCases/createQuotation.useCase';
import { UpdateQuotationUseCase } from '../../../../contexts/quotation/useCases/updateQuotation.useCase';
import { GetQuotationUseCase } from '../../../../contexts/quotation/useCases/getQuotation.useCase';
import { DeleteQuotationUseCase } from '../../../../contexts/quotation/useCases/deleteQuotation.useCase';
import { CompareQuotationsUseCase } from '../../../../contexts/quotation/useCases/compareQuotations.useCase';
import { SendNotificationUseCase } from '../../../../contexts/notification/useCases/sendNotification.useCase';
import { GetQuotationsByRequestUseCase } from '../../../../contexts/quotation/useCases/getQuotationsByRequest.useCase';
import { GetAllQuotationsByUserIdUseCase } from '../../../../contexts/quotation/useCases/getAllQuotationsByUserId.useCase';
import { GetReceivedQuotationsByUserIdUseCase } from '../../../../contexts/quotation/useCases/getReceivedQuotationsByUserId.useCase';

// Controladores
import { CreateQuotationController } from '../../controllers/quotation/createQuotation/createQuotation.controller';
import { UpdateQuotationController } from '../../controllers/quotation/updateQuotation/updateQuotation.controller';
import { GetQuotationController } from '../../controllers/quotation/getQuotation/getQuotation.controller';
import { DeleteQuotationController } from '../../controllers/quotation/deleteQuotation/deleteQuotation.controller';
import { CompareQuotationsController } from '../../controllers/quotation/compareQuotations/compareQuotations.controller';
import { GetQuotationsByRequestController } from '../../controllers/quotation/getQuotationsByRequest/getQuotationsByRequest.controller';
import { GetAllQuotationsByUserIdController } from '../../controllers/quotation/getAllQuotationsByUserId/getAllQuotationsByUserId.controller';
import { GetReceivedQuotationsByUserIdController } from '../../controllers/quotation/getReceivedQuotationsByUserId/getReceivedQuotationsByUserId.controller';

// Middlewares
import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { BusinessStatusValidator } from '../../middlewares/businessStatus';
import { createQuotationValidationRules } from '../../controllers/quotation/createQuotation/createQuotation.validator';
import { updateQuotationValidationRules } from '../../controllers/quotation/updateQuotation/updateQuotation.validator';

const router = Router();

// 1. Instanciar Infraestructura
const quotationRepo = new TypeORMQuotationRepository();
const requestRepo = new TypeORMQuotationRequestRepository();
const notifyRepo = new TypeORMNotificationRepository();
const userRepository = new TypeORMUserRepository();
const planRepository = new TypeORMPlanRepository();

// 2. Instanciar Casos de Uso
const sendNotifyUseCase = new SendNotificationUseCase(notifyRepo);

const createUseCase = new CreateQuotationUseCase(
  quotationRepo,
  requestRepo,
  sendNotifyUseCase,
  userRepository,
  planRepository,
);
const updateUseCase = new UpdateQuotationUseCase(quotationRepo);
const getUseCase = new GetQuotationUseCase(quotationRepo, requestRepo);
const deleteUseCase = new DeleteQuotationUseCase(quotationRepo);
const compareUseCase = new CompareQuotationsUseCase(quotationRepo, requestRepo);
const getByRequestUseCase = new GetQuotationsByRequestUseCase(
  quotationRepo,
  requestRepo,
);
const getAllByUserIdUseCase = new GetAllQuotationsByUserIdUseCase(
  quotationRepo,
  requestRepo,
);
const getReceivedByUserIdUseCase = new GetReceivedQuotationsByUserIdUseCase(
  quotationRepo,
);

// 3. Instanciar Controladores
const createCtrl = new CreateQuotationController(createUseCase);
const updateCtrl = new UpdateQuotationController(updateUseCase);
const getCtrl = new GetQuotationController(getUseCase);
const deleteCtrl = new DeleteQuotationController(deleteUseCase);
const compareCtrl = new CompareQuotationsController(compareUseCase);
const getByRequestCtrl = new GetQuotationsByRequestController(
  getByRequestUseCase,
);
const getAllByUserIdCtrl = new GetAllQuotationsByUserIdController(
  getAllByUserIdUseCase,
);
const getReceivedByUserIdCtrl = new GetReceivedQuotationsByUserIdController(
  getReceivedByUserIdUseCase,
);

// --- 4. Definición de Rutas ---

/**
 * LISTAR ofertas de una solicitud
 * CORRECCIÓN: Se agrega BusinessStatusValidator para proteger la operación.
 */
router.get(
  '/request/:quotationRequestId',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) =>
    getByRequestCtrl.handle(req as AuthRequest, res),
);

/**
 * HISTORIAL del proveedor (Borradores y Enviadas)
 */
router.get(
  '/my-history',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => getAllByUserIdCtrl.handle(req as AuthRequest, res),
);

/**
 * HISTORIAL de ofertas recibidas por el comprador
 */
router.get(
  '/received',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => getReceivedByUserIdCtrl.handle(req as AuthRequest, res),
);

/**
 * CREAR una cotización
 */
router.post(
  '/request/:quotationRequestId',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  createQuotationValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => createCtrl.handle(req as AuthRequest, res),
);

/**
 * COMPARAR ofertas (Mejor precio vs Mejor tiempo)
 * CORRECCIÓN: Se agrega BusinessStatusValidator.
 */
router.get(
  '/compare/:quotationRequestId',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) => compareCtrl.handle(req as AuthRequest, res),
);

/**
 * DETALLE de una cotización específica
 * CORRECCIÓN: Se agrega BusinessStatusValidator.
 */
router.get(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) => getCtrl.handle(req as AuthRequest, res),
);

/**
 * ACTUALIZAR oferta
 */
router.patch(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  updateQuotationValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => updateCtrl.handle(req as AuthRequest, res),
);

/**
 * ELIMINAR oferta
 */
router.delete(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => deleteCtrl.handle(req as AuthRequest, res),
);

export const quotationRoutes = router;
