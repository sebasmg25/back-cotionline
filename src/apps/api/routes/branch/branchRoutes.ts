import { Router, Request, Response } from 'express';

import { TypeORMBranchRepository } from '../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository';
import { TypeORMBusinessRepository } from '../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';
import { TypeORMQuotationRequestRepository } from '../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';

import { CreateBranchUseCase } from '../../../../contexts/branch/useCases/createBranch.useCase';
import { UpdateBranchUseCase } from '../../../../contexts/branch/useCases/updateBranch.useCase';
import { GetBranchUseCase } from '../../../../contexts/branch/useCases/getBranch.useCase';
import { DeleteBranchUseCase } from '../../../../contexts/branch/useCases/deleteBranch.useCase';
import { GetBranchesByBusinessIdUseCase } from '../../../../contexts/branch/useCases/getBranchesByBusinessId.useCase';

import { CreateBranchController } from '../../controllers/branch/createBranch/createBranch.controller';
import { UpdateBranchController } from '../../controllers/branch/updateBranch/updateBranch.controller';
import { GetBranchController } from '../../controllers/branch/getBranch/getBranch.controller';
import { DeleteBranchController } from '../../controllers/branch/deleteBranch/deleteBranch.controller';
import { GetBranchesByBusinessIdController } from '../../controllers/branch/getBranchesByBusinessId/getBranchesByBusinessId.controller';

import { createBranchValidationRules } from '../../controllers/branch/createBranch/createBranch.validator';
import { updateBranchValidationRules } from '../../controllers/branch/updateBranch/updateBranch.validator';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { RequestValidator } from '../../middlewares/validateRequest';
import { BusinessStatusValidator } from '../../middlewares/businessStatus';
import { BcryptPasswordHasher } from '../../../../contexts/user/infraestructure/security/bcryptPasswordHasher';

const router = Router();


const branchRepository = new TypeORMBranchRepository();
const businessRepository = new TypeORMBusinessRepository();
const quotationRequestRepository = new TypeORMQuotationRequestRepository();
const passwordHasher = new BcryptPasswordHasher();


const createBranchUseCase = new CreateBranchUseCase(
  branchRepository,
  businessRepository,
);
const updateBranchUseCase = new UpdateBranchUseCase(
  branchRepository,
  businessRepository,
);
const getBranchUseCase = new GetBranchUseCase(
  branchRepository,
  businessRepository,
);
const deleteBranchUseCase = new DeleteBranchUseCase(
  branchRepository,
  businessRepository,
  quotationRequestRepository,
);
const getBranchesByBusinessIdUseCase = new GetBranchesByBusinessIdUseCase(
  branchRepository,
  businessRepository,
);


const createBranchController = new CreateBranchController(createBranchUseCase);
const updateBranchController = new UpdateBranchController(updateBranchUseCase);
const getBranchController = new GetBranchController(getBranchUseCase);
const deleteBranchController = new DeleteBranchController(deleteBranchUseCase);
const getBranchesByBusinessIdController = new GetBranchesByBusinessIdController(
  getBranchesByBusinessIdUseCase,
);

router.post(
  '/register',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  createBranchValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) =>
    createBranchController.handle(req as AuthRequest, res),
);

router.patch(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  updateBranchValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) =>
    updateBranchController.handle(req as AuthRequest, res),
);

router.get(
  '/business/:businessId',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    getBranchesByBusinessIdController.handle(req as AuthRequest, res),
);

router.get(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, 
  (req: Request, res: Response) =>
    getBranchController.handle(req as AuthRequest, res),
);

router.delete(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) =>
    deleteBranchController.handle(req as AuthRequest, res),
);

export const branchRoutes = router;
