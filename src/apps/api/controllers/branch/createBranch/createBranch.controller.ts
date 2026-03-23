import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CreateBranchUseCase } from '../../../../../contexts/branch/useCases/createBranch.useCase';
import { CreateBranchRequest } from '../../../../../contexts/branch/interfaces/dtos/branch.dto';

export class CreateBranchController {
  constructor(private createBranchUseCase: CreateBranchUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      
      const userId = req.userSession!.id;

      const branchData: CreateBranchRequest = req.body;

      
      const savedBranch = await this.createBranchUseCase.execute(
        branchData,
        userId,
      );

      res.status(201).json({
        message: 'Sede creada con éxito',
        data: savedBranch,
      });
    } catch (error: any) {
      
      if (
        error.message === 'No tienes permiso para agregar sedes a este negocio.'
      ) {
        res.status(403).json({ message: error.message });
        return;
      }

      if (error.message === 'Ya existe una sede con este nombre.') {
        res.status(409).json({ message: error.message });
        return;
      }

      if (error.message === 'El negocio especificado no existe.') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('[CreateBranchController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
