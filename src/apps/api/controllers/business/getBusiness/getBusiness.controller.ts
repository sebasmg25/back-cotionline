import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetBusinessUseCase } from '../../../../../contexts/business/useCases/getBusiness.useCase';

export class GetBusinessController {
  constructor(private getBusinessUseCase: GetBusinessUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userSession = req.userSession!;

      
      const business = await this.getBusinessUseCase.execute(id, userSession);

      res.status(200).json({
        message: 'Negocio obtenido con éxito.',
        data: business,
      });
    } catch (error: any) {

      if (error.message === 'Negocio no encontrado.') {
        res.status(404).json({ message: error.message });
        return;
      }


      if (error.message === 'No tienes permiso para acceder a este negocio.') {
        res.status(403).json({ message: error.message });
        return;
      }


      console.error('[GetBusinessController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
