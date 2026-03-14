import { Router, Request, Response } from 'express';

// Infraestructura
import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';

// Casos de Uso
import { GetNotificationsByUserUseCase } from '../../../../contexts/notification/useCases/getNotificacionsByUser.useCase';
import { MarkNotificationAsReadUseCase } from '../../../../contexts/notification/useCases/markNotificationAsRead.useCase';

// Controladores
import { GetNotificationsByUserController } from '../../controllers/notification/getNotificationsByUser/getNotificationsByUser.controller';
import { MarkNotificationAsReadController } from '../../controllers/notification/markNotificationAsRead/markNotificationAsRead.controller';

// Middlewares
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { BusinessStatusValidator } from '../../middlewares/businessStatus'; // <-- Importado

const router = Router();

// 1. Instanciar Infraestructura
const notificationRepo = new TypeORMNotificationRepository();

// 2. Instanciar Casos de Uso
const getNotificationsUseCase = new GetNotificationsByUserUseCase(
  notificationRepo,
);
const markAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepo);

// 3. Instanciar Controladores
const getNotificationsCtrl = new GetNotificationsByUserController(
  getNotificationsUseCase,
);
const markAsReadCtrl = new MarkNotificationAsReadController(markAsReadUseCase);

// --- 4. Definición de Rutas ---

/**
 * Obtener notificaciones del usuario actual.
 * CORRECCIÓN: Se agrega BusinessStatusValidator para bloquear acceso si el negocio no está verificado.
 */
router.get(
  '/',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) =>
    getNotificationsCtrl.handle(req as AuthRequest, res),
);

/**
 * Marcar como leída una notificación específica.
 * CORRECCIÓN: Se agrega BusinessStatusValidator.
 */
router.patch(
  '/:id/read',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) =>
    markAsReadCtrl.handle(req as AuthRequest, res),
);

export const notificationRoutes = router;
