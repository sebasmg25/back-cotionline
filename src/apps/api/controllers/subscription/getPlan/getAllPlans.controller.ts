import { Request, Response } from 'express';
import { GetAllPlansUseCase } from '../../../../../contexts/subscription/useCases/getAllPlans.useCase';

export class GetAllPlansController {
  constructor(private getAllPlansUseCase: GetAllPlansUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      
      const plans = await this.getAllPlansUseCase.execute();

      res.status(200).json({
        message: 'Planes obtenidos con éxito.',
        data: plans,
      });
    } catch (error: any) {
      console.error('[GetAllPlansController] Error:', error);

      res.status(500).json({
        message: 'Error interno del servidor al obtener el catálogo de planes.',
      });
    }
  }
}
