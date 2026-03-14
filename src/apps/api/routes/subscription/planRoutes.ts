import { Router, Request, Response } from 'express';
import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { TypeORMPaymentTransactionRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPaymentTransaction';
import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';

// Casos de Uso
import { GetAllPlansUseCase } from '../../../../contexts/subscription/useCases/getAllPlans.useCase';
import { InitializePaymentUseCase } from '../../../../contexts/subscription/useCases/initializePayment.useCase';
import { UpdatePaymentStatusUseCase } from '../../../../contexts/subscription/useCases/updatePaymentStatus.useCase';

// Controladores
import { GetAllPlansController } from '../../controllers/subscription/getPlan/getAllPlans.controller';
import { InitializePaymentController } from '../../controllers/subscription/payment/initializePayment.controller';
import { WompiWebhookController } from '../../controllers/subscription/payment/wompiWebhook.controller';

// Middlewares
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';

const router = Router();

// 1. Instanciar Infraestructura
const planRepository = new TypeORMPlanRepository();
const transactionRepository = new TypeORMPaymentTransactionRepository();
const userRepository = new TypeORMUserRepository();

// 2. Instanciar Casos de Uso
const getAllPlansUseCase = new GetAllPlansUseCase(planRepository);
const updatePaymentStatusUseCase = new UpdatePaymentStatusUseCase(
  transactionRepository,
  userRepository,
);
const initializePaymentUseCase = new InitializePaymentUseCase(
  planRepository,
  transactionRepository,
);

// 3. Instanciar Controladores
const getAllPlansCtrl = new GetAllPlansController(getAllPlansUseCase);
const wompiWebhookCtrl = new WompiWebhookController(updatePaymentStatusUseCase);
const initializePaymentCtrl = new InitializePaymentController(
  initializePaymentUseCase,
);

// --- 4. Definición de Rutas ---

/**
 * PÚBLICO: Ver planes disponibles.
 */
router.get('/plans', (req: Request, res: Response) =>
  getAllPlansCtrl.handle(req, res),
);

/**
 * PÚBLICO: Webhook de Wompi.
 */
router.post('/wompi-webhook', (req: Request, res: Response) =>
  wompiWebhookCtrl.handle(req, res),
);

/**
 * PRIVADO: Inicializar flujo de pago.
 * NO requiere BusinessStatusValidator para permitir el pago en cualquier estado del negocio.
 */
router.post(
  '/initialize-payment',
  JwtVerifier.handler,
  (req: Request, res: Response) =>
    initializePaymentCtrl.handle(req as AuthRequest, res),
);

export const subscriptionRoutes = router;
