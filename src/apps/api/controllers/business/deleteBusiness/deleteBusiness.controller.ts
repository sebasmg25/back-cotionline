import { Request, Response } from 'express';
import { DeleteBusinessUseCase } from '../../../../../contexts/business/useCases/deleteBusinessUseCase';
import { TypeORMBusinessRepository } from '../../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';

export class DeleteBusinessController {
  private deleteBusinessUseCase: DeleteBusinessUseCase;
  constructor() {
    const businessRepository = new TypeORMBusinessRepository();
    this.deleteBusinessUseCase = new DeleteBusinessUseCase(businessRepository);
  }

  async deleteBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteBusiness = await this.deleteBusinessUseCase.delete(id);

      res.status(200).json({
        message: 'Negocio eliminado exitosamente',
        data: deleteBusiness,
      });
    } catch (error: any) {
      console.log('Error al eliminar el negocio:', error);
      if (error.message.includes('No existe')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }
}
