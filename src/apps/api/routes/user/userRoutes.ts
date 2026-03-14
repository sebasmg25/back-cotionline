import { Router, Request, Response } from 'express';

// --- Infraestructura Contexto Usuario ---
import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';
import { JwtTokenService } from '../../../../contexts/user/infraestructure/security/jwtTokenService';
import { BcryptPasswordHasher } from '../../../../contexts/user/infraestructure/security/bcryptPasswordHasher';

// --- Infraestructura Otros Contextos ---
import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';
import { TypeORMCollaboratorRepository } from '../../../../contexts/collaborator/infraestructure/persistance/typeorm/typeOrmCollaboratorRepository';

// --- Casos de Uso ---
import { RegisterUserUseCase } from '../../../../contexts/user/useCases/registerUser.useCase';
import { LoginUserUseCase } from '../../../../contexts/user/useCases/loginUser.useCase';
import { GetUserUseCase } from '../../../../contexts/user/useCases/getUser.useCase';
import { UpdateUserUseCase } from '../../../../contexts/user/useCases/updateUser.useCase';
import { DeleteUserUseCase } from '../../../../contexts/user/useCases/deleteUser.useCase';
import { CheckPlanExpirationUseCase } from '../../../../contexts/subscription/useCases/checkPlanExpiration.useCase';
import { SendNotificationUseCase } from '../../../../contexts/notification/useCases/sendNotification.useCase';

// --- Controladores ---
import { CreateUserController } from '../../controllers/user/createUser/createUser.controller';
import { LoginUserController } from '../../controllers/user/loginUser/loginUser.controller';
import { UpdateUserController } from '../../controllers/user/updateUser/updateUser.controller';
import { GetUserController } from '../../controllers/user/getUser/getUser.controller';
import { DeleteUserController } from '../../controllers/user/deleteUser/deleteUser.controller';
import { GetUserSessionController } from '../../controllers/user/userSession/getUserSession.controller';

// --- Middlewares y Validadores ---
import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { createUserValidationRules } from '../../controllers/user/createUser/createUser.validator';
import { loginUserValidationRules } from '../../controllers/user/loginUser/loginUser.validator';
import { updateUserValidationRules } from '../../controllers/user/updateUser/updateUser.validator';

const router = Router();

// 1. Instanciar Dependencias
const userRepo = new TypeORMUserRepository();
const collaboratorRepo = new TypeORMCollaboratorRepository();
const planRepository = new TypeORMPlanRepository();
const notificationRepository = new TypeORMNotificationRepository();
const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();

// 2. Instanciar Casos de Uso
const registerUC = new RegisterUserUseCase(
  userRepo,
  tokenService,
  passwordHasher,
  planRepository,
  collaboratorRepo,
);
const loginUC = new LoginUserUseCase(
  userRepo,
  tokenService,
  passwordHasher,
  collaboratorRepo,
);
const getUserUC = new GetUserUseCase(userRepo);
const updateUC = new UpdateUserUseCase(userRepo, passwordHasher);
const deleteUC = new DeleteUserUseCase(userRepo);
const sendNotificationUC = new SendNotificationUseCase(notificationRepository);
const checkPlanExpirationUC = new CheckPlanExpirationUseCase(
  planRepository,
  userRepo,
  notificationRepository,
  sendNotificationUC,
);

// 3. Instanciar Controladores
const createCtrl = new CreateUserController(registerUC);
const loginCtrl = new LoginUserController(loginUC);
const updateCtrl = new UpdateUserController(updateUC);
const getCtrl = new GetUserController(getUserUC);
const deleteCtrl = new DeleteUserController(deleteUC);
const sessionCtrl = new GetUserSessionController(
  getUserUC,
  checkPlanExpirationUC,
);

// --- RUTAS PÚBLICAS ---
router.post(
  '/register',
  createUserValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => createCtrl.handle(req, res),
);

router.post(
  '/login',
  loginUserValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => loginCtrl.handle(req, res),
);

// --- RUTAS PRIVADAS (Solo JWT) ---
// Nota: No incluimos BusinessStatusValidator para permitir gestión de cuenta personal.

router.get('/session', JwtVerifier.handler, (req: Request, res: Response) =>
  sessionCtrl.handle(req as AuthRequest, res),
);

router.get('/profile', JwtVerifier.handler, (req: Request, res: Response) =>
  getCtrl.handle(req as AuthRequest, res),
);

router.patch(
  '/profile/update',
  JwtVerifier.handler,
  updateUserValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => updateCtrl.handle(req as AuthRequest, res),
);

router.delete(
  '/profile/delete',
  JwtVerifier.handler,
  (req: Request, res: Response) => deleteCtrl.handle(req as AuthRequest, res),
);

export const userRoutes = router;
