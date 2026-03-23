import { Router, Request, Response } from 'express';

import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';
import { JwtTokenService } from '../../../../contexts/user/infraestructure/security/jwtTokenService';
import { BcryptPasswordHasher } from '../../../../contexts/user/infraestructure/security/bcryptPasswordHasher';

import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';
import { TypeORMCollaboratorRepository } from '../../../../contexts/collaborator/infraestructure/persistance/typeorm/typeOrmCollaboratorRepository';

import { RegisterUserUseCase } from '../../../../contexts/user/useCases/registerUser.useCase';
import { LoginUserUseCase } from '../../../../contexts/user/useCases/loginUser.useCase';
import { GetUserUseCase } from '../../../../contexts/user/useCases/getUser.useCase';
import { UpdateUserUseCase } from '../../../../contexts/user/useCases/updateUser.useCase';
import { DeleteUserUseCase } from '../../../../contexts/user/useCases/deleteUser.useCase';
import { CheckPlanExpirationUseCase } from '../../../../contexts/subscription/useCases/checkPlanExpiration.useCase';
import { SendNotificationUseCase } from '../../../../contexts/notification/useCases/sendNotification.useCase';
import { RequestPasswordResetUseCase } from '../../../../contexts/user/useCases/requestPasswordReset.useCase';
import { ResetPasswordUseCase } from '../../../../contexts/user/useCases/resetPassword.useCase';
import { EmailService } from '../../../../contexts/shared/infraestructure/email/nodemailer.service';

import { CreateUserController } from '../../controllers/user/createUser/createUser.controller';
import { LoginUserController } from '../../controllers/user/loginUser/loginUser.controller';
import { UpdateUserController } from '../../controllers/user/updateUser/updateUser.controller';
import { GetUserController } from '../../controllers/user/getUser/getUser.controller';
import { DeleteUserController } from '../../controllers/user/deleteUser/deleteUser.controller';
import { GetUserSessionController } from '../../controllers/user/userSession/getUserSession.controller';
import { ForgotPasswordController } from '../../controllers/user/forgotPassword/forgotPassword.controller';
import { ResetPasswordController } from '../../controllers/user/resetPassword/resetPassword.controller';

import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { createUserValidationRules } from '../../controllers/user/createUser/createUser.validator';
import { loginUserValidationRules } from '../../controllers/user/loginUser/loginUser.validator';
import { updateUserValidationRules } from '../../controllers/user/updateUser/updateUser.validator';
import { forgotPasswordValidationRules } from '../../controllers/user/forgotPassword/forgotPassword.validator';
import { resetPasswordValidationRules } from '../../controllers/user/resetPassword/resetPassword.validator';

const router = Router();


const userRepo = new TypeORMUserRepository();
const collaboratorRepo = new TypeORMCollaboratorRepository();
const planRepository = new TypeORMPlanRepository();
const notificationRepository = new TypeORMNotificationRepository();
const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();


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

const emailService = new EmailService();
const requestResetUC = new RequestPasswordResetUseCase(userRepo, emailService);
const resetPassUC = new ResetPasswordUseCase(userRepo);


const createCtrl = new CreateUserController(registerUC);
const loginCtrl = new LoginUserController(loginUC);
const updateCtrl = new UpdateUserController(updateUC);
const getCtrl = new GetUserController(getUserUC);
const deleteCtrl = new DeleteUserController(deleteUC);
const sessionCtrl = new GetUserSessionController(
  getUserUC,
  checkPlanExpirationUC,
);

const forgotCtrl = new ForgotPasswordController(requestResetUC);
const resetCtrl = new ResetPasswordController(resetPassUC);

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

router.post(
  '/forgot-password',
  forgotPasswordValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => forgotCtrl.handle(req, res)
);

router.post(
  '/reset-password',
  resetPasswordValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => resetCtrl.handle(req, res)
);


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
