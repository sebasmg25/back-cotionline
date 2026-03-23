import { Router, Request, Response } from 'express';

import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';

import { GetNotificationsByUserUseCase } from '../../../../contexts/notification/useCases/getNotificacionsByUser.useCase';
import { MarkNotificationAsReadUseCase } from '../../../../contexts/notification/useCases/markNotificationAsRead.useCase';

import { GetNotificationsByUserController } from '../../controllers/notification/getNotificationsByUser/getNotificationsByUser.controller';
import { MarkNotificationAsReadController } from '../../controllers/notification/markNotificationAsRead/markNotificationAsRead.controller';

import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { BusinessStatusValidator } from '../../middlewares/businessStatus'; // <-- Importado

const router = Router();


const notificationRepo = new TypeORMNotificationRepository();


const getNotificationsUseCase = new GetNotificationsByUserUseCase(
  notificationRepo,
);
const markAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepo);


const getNotificationsCtrl = new GetNotificationsByUserController(
  getNotificationsUseCase,
);
const markAsReadCtrl = new MarkNotificationAsReadController(markAsReadUseCase);

router.get(
  '/',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    getNotificationsCtrl.handle(req as AuthRequest, res),
);

router.patch(
  '/:id/read',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, 
  (req: Request, res: Response) =>
    markAsReadCtrl.handle(req as AuthRequest, res),
);

export const notificationRoutes = router;
