
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateBranchUseCase } from '../../../../../contexts/branch/useCases/updateBranch.useCase';
import { TypeORMBranchRepository } from '../../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository';
import { UpdateBranchDto } from '../../../../../contexts/branch/interfaces/dtos/updateBranch.dto';

const branchRepository = new TypeORMBranchRepository();
const updateBranchUseCase = new UpdateBranchUseCase(branchRepository);

export async function UpdateBranchController(req: Request<any, any, UpdateBranchDto>, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sedeId = req.params.id;
    const updatedData: UpdateBranchDto = req.body;
    
    const updatedSede = await updateBranchUseCase.execute(sedeId, updatedData);

    res.status(200).json({ message: 'Sede actualizada exitosamente', sede: updatedSede });
  } catch (error: any) {
    if (error.message === 'Sede no encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'El nuevo nombre de sede ya está en uso.') {
      return res.status(409).json({ message: error.message });
    }
    console.error('Error al actualizar sede:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}