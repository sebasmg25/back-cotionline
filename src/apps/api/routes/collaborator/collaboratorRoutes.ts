import { Router, Request, Response } from 'express';

import { TypeORMCollaboratorRepository } from '../../../../contexts/collaborator/infraestructure/persistance/typeorm/typeOrmCollaboratorRepository';
import { TypeORMNotificationRepository } from '../../../../contexts/notification/infraestructure/persistance/typeorm/typeOrmNotificationRepository';
import { TypeORMUserRepository } from '../../../../contexts/user/infraestructure/persistance/typeorm/typeOrmUserRepository';
import { TypeORMPlanRepository } from '../../../../contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { EmailService } from '../../../../contexts/shared/infraestructure/email/nodemailer.service';

import { CreateCollaboratorUseCase } from '../../../../contexts/collaborator/useCases/createCollaborator.useCase';
import { UpdateCollaboratorUseCase } from '../../../../contexts/collaborator/useCases/updateCollaborator.useCase';
import { GetCollaboratorUseCase } from '../../../../contexts/collaborator/useCases/getCollaborator.useCase';
import { GetCollaboratorsByUserIdUseCase } from '../../../../contexts/collaborator/useCases/getCollaboratorsByUserId.useCase';
import { DeleteCollaboratorUseCase } from '../../../../contexts/collaborator/useCases/deleteCollaborator.useCase';
import { AcceptInvitationUseCase } from '../../../../contexts/collaborator/useCases/acceptInvitation.useCase';
import { RejectInvitationUseCase } from '../../../../contexts/collaborator/useCases/rejectInvitation.useCase';
import { GetActiveCollaboratorsUseCase } from '../../../../contexts/collaborator/useCases/getActiveCollaborators.useCase';
import { DeleteActiveCollaboratorUseCase } from '../../../../contexts/collaborator/useCases/deleteActiveCollaborator.useCase';
import { SendNotificationUseCase } from '../../../../contexts/notification/useCases/sendNotification.useCase';

import { CreateCollaboratorController } from '../../controllers/collaborator/createCollaborator/createCollaborator.controller';
import { UpdateCollaboratorController } from '../../controllers/collaborator/updateCollaborator/updateCollaborator.controller';
import { GetCollaboratorController } from '../../controllers/collaborator/getCollaborator/getCollaborator.controller';
import { GetCollaboratorsByUserIdController } from '../../controllers/collaborator/getCollaboratorsByUserId/getCollaboratorsByUserId.controller';
import { DeleteCollaboratorController } from '../../controllers/collaborator/deleteCollaborator/deleteCollaborator.controller';
import { AcceptInvitationController } from '../../controllers/collaborator/acceptInvitation/acceptInvitation.controller';
import { RejectInvitationController } from '../../controllers/collaborator/rejectInvitation/rejectInvitation.controller';
import { GetActiveCollaboratorsController } from '../../controllers/collaborator/getActiveCollaborators/getActiveCollaborators.controller';
import { DeleteActiveCollaboratorController } from '../../controllers/collaborator/deleteActiveCollaborator/deleteActiveCollaborator.controller';

import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { BusinessStatusValidator } from '../../middlewares/businessStatus';
import { createCollaboratorValidationRules } from '../../controllers/collaborator/createCollaborator/createCollaborator.validator';
import { updateCollaboratorValidationRules } from '../../controllers/collaborator/updateCollaborator/updateCollaborator.validator';

const router = Router();


const collaboratorRepo = new TypeORMCollaboratorRepository();
const notificationRepo = new TypeORMNotificationRepository();
const userRepository = new TypeORMUserRepository();
const planRepository = new TypeORMPlanRepository();
const emailService = new EmailService();


const sendNotificationUseCase = new SendNotificationUseCase(notificationRepo);
const createUseCase = new CreateCollaboratorUseCase(
  collaboratorRepo,
  emailService,
  userRepository,
  planRepository,
);
const updateUseCase = new UpdateCollaboratorUseCase(collaboratorRepo);
const getUseCase = new GetCollaboratorUseCase(collaboratorRepo);
const getByOwnerUseCase = new GetCollaboratorsByUserIdUseCase(collaboratorRepo);
const deleteUseCase = new DeleteCollaboratorUseCase(collaboratorRepo);
const getActiveUseCase = new GetActiveCollaboratorsUseCase(userRepository);
const deleteActiveUseCase = new DeleteActiveCollaboratorUseCase(
  userRepository,
  collaboratorRepo,
);
const acceptUseCase = new AcceptInvitationUseCase(
  collaboratorRepo,
  sendNotificationUseCase,
);
const rejectUseCase = new RejectInvitationUseCase(
  collaboratorRepo,
  sendNotificationUseCase,
);


const createController = new CreateCollaboratorController(createUseCase);
const updateController = new UpdateCollaboratorController(updateUseCase);
const getController = new GetCollaboratorController(getUseCase);
const getByOwnerController = new GetCollaboratorsByUserIdController(
  getByOwnerUseCase,
);
const deleteController = new DeleteCollaboratorController(deleteUseCase);
const getActiveController = new GetActiveCollaboratorsController(getActiveUseCase);
const deleteActiveController = new DeleteActiveCollaboratorController(deleteActiveUseCase);
const acceptController = new AcceptInvitationController(acceptUseCase);
const rejectController = new RejectInvitationController(rejectUseCase);

router.get(
  '/',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    getByOwnerController.handle(req as AuthRequest, res),
);

router.get(
  '/active',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    getActiveController.handle(req as AuthRequest, res),
);

router.get(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    getController.handle(req as AuthRequest, res),
);

router.post(
  '/register',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  createCollaboratorValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) =>
    createController.handle(req as AuthRequest, res),
);

router.patch(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  updateCollaboratorValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) =>
    updateController.handle(req as AuthRequest, res),
);

router.delete(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    deleteController.handle(req as AuthRequest, res),
);

router.delete(
  '/active/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    deleteActiveController.handle(req as AuthRequest, res),
);

router.patch('/:id/accept', (req: Request, res: Response) =>
  acceptController.handle(req, res),
);
router.patch('/:id/reject', (req: Request, res: Response) =>
  rejectController.handle(req, res),
);

export const collaboratorRoutes = router;
