import { Router } from "express";
import { CreateBranchController } from "../controllers/branch/createBranch/createBranch.controller";
import {createBranchValidationRules} from '../controllers/branch/createBranch/createBranch.validator';
import { UpdateBranchController } from "../controllers/branch/updateBranch/updateBranch.controller";
import { updateUserValidationRules } from "../controllers/user/updateUser/updateUser.validator";
import { getBranchController } from "../controllers/branch/getBranch/getBranch.controller";
import { deleteBranchController } from "../controllers/branch/deleteBranch/deleteBranch.controller";

const router = Router();

router.post('/create', createBranchValidationRules, CreateBranchController);
router.put('/:id', updateUserValidationRules, UpdateBranchController);
router.get('/:id', getBranchController);
router.delete('/:id', deleteBranchController);

export { router as branchRoutes};