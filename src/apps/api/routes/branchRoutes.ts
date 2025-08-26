import { Router } from "express";
import { CreateBranchController } from "../controllers/branch/createBranch/createBranch.controller";
import {createBranchValidationRules} from '../controllers/branch/createBranch/createBranch.validator';

const router = Router();

router.post('/sedes', createBranchValidationRules, CreateBranchController);

export { router as branchRoutes};