
import { Request, Response } from 'express';
import { DeleteBranchUseCase } from '../../../../../contexts/branch/useCases/deleteBranch.useCase';
import { TypeORMBranchRepository } from '../../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository';

const branchRepository = new TypeORMBranchRepository();
const deleteBranchUseCase = new DeleteBranchUseCase(branchRepository);

export async function deleteBranchController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteBranchUseCase.execute(id);
    res.status(200).json({ message: 'Sede eliminada con éxito.' });
  } catch (error: any) {
    if (error.message === 'Sede no encontrada.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}