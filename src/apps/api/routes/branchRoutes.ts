import { Router } from "express";
import { CreateBranchController } from "../controllers/branch/createBranch/createBranch.controller";
import {createBranchValidationRules} from '../controllers/branch/createBranch/createBranch.validator';
import { UpdateBranchController } from "../controllers/branch/updateBranch/updateBranch.controller";
import {UpdateBranchValidationRules} from '../controllers/branch/updateBranch/updateBranch.validator';
import { getBranchController } from "../controllers/branch/getBranch/getBranch.controller";
import { deleteBranchController } from "../controllers/branch/deleteBranch/deleteBranch.controller";

const router = Router();
const branchController = new CreateBranchController;

router.post('/create', createBranchValidationRules, branchController.createBranch.bind(branchController));
router.patch('/:id', UpdateBranchValidationRules, branchController.updateBranch.bind(branchController));
router.get('/:id', getBranchController);
router.delete('/:id', deleteBranchController);

export { router as branchRoutes};