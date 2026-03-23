import { Router, Request, Response } from 'express';
import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { TypeORMPaymentTransactionRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPaymentTransaction';
import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';

import { GetAllPlansUseCase } from '../../../../contexts/subscription/useCases/getAllPlans.useCase';
import { InitializePaymentUseCase } from '../../../../contexts/subscription/useCases/initializePayment.useCase';
import { UpdatePaymentStatusUseCase } from '../../../../contexts/subscription/useCases/updatePaymentStatus.useCase';

import { GetAllPlansController } from '../../controllers/subscription/getPlan/getAllPlans.controller';
import { InitializePaymentController } from '../../controllers/subscription/payment/initializePayment.controller';
import { WompiWebhookController } from '../../controllers/subscription/payment/wompiWebhook.controller';

import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';

const router = Router();


const planRepository = new TypeORMPlanRepository();
const transactionRepository = new TypeORMPaymentTransactionRepository();
const userRepository = new TypeORMUserRepository();


const getAllPlansUseCase = new GetAllPlansUseCase(planRepository);
const updatePaymentStatusUseCase = new UpdatePaymentStatusUseCase(
  transactionRepository,
  userRepository,
);
const initializePaymentUseCase = new InitializePaymentUseCase(
  planRepository,
  transactionRepository,
);


const getAllPlansCtrl = new GetAllPlansController(getAllPlansUseCase);
const wompiWebhookCtrl = new WompiWebhookController(updatePaymentStatusUseCase);
const initializePaymentCtrl = new InitializePaymentController(
  initializePaymentUseCase,
);

router.get('/plans', (req: Request, res: Response) =>
  getAllPlansCtrl.handle(req, res),
);

router.post('/wompi-webhook', (req: Request, res: Response) =>
  wompiWebhookCtrl.handle(req, res),
);

router.post(
  '/initialize-payment',
  JwtVerifier.handler,
  (req: Request, res: Response) =>
    initializePaymentCtrl.handle(req as AuthRequest, res),
);

export const subscriptionRoutes = router;
