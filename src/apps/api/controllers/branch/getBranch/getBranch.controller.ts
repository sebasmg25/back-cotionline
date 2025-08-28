// src/infrastructure/api/controllers/getBranch.controller.ts

import { Request, Response } from 'express';
import { GetBranchUseCase } from '../../../../../contexts/branch/useCases/getBranch.useCase';
import { TypeORMBranchRepository } from '../../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository';

const branchRepository = new TypeORMBranchRepository();
const getBranchUseCase = new GetBranchUseCase(branchRepository);

export async function getBranchController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const branch = await getBranchUseCase.execute(id);

    res.status(200).json({ branch });
  } catch (error: any) {
    if (error.message === 'Sede no encontrada.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}