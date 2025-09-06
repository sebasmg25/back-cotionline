import { Request, Response } from 'express';
import { UpdateBusinessUseCase } from '../../../../../contexts/business/useCases/updateBusiness.useCase';
import { TypeORMBusinessRepository } from '../../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';

export class UpdateBusinessController {
  private updateBusinessUseCase: UpdateBusinessUseCase;
  constructor() {
    const businessRepository = new TypeORMBusinessRepository();
    this.updateBusinessUseCase = new UpdateBusinessUseCase(businessRepository);
  }

  async updateBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nit, name, description, address } = req.body;

      const updateBusiness = await this.updateBusinessUseCase.update(
        id,
        nit,
        name,
        description,
        address
      );

      res.status(200).json({
        message: 'Negocio actualizado exitosamente',
        data: updateBusiness,
      });
    } catch (error: any) {
      console.log('Error al actualizar el negocio:', error);
      if (error.message.includes('No existe.')) {
        res.status(404).json({ message: error.message });
      } else if (error.message.includes('Ya existe.')) {
        res.status(409).json({ message: error.message });
      } else if (
        error.message.includes(
          'No se detectaron cambios en los campos enviados.'
        )
      ) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }
}
