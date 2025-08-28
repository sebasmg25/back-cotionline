import { Request, Response } from 'express';
import { RegisterBusinessUseCase } from '../../../../../contexts/business/useCases/registerBusiness.useCase';
import { TypeORMBusinessRepository } from '../../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';

export class CreateBusinessController {
  private registerBusinessUseCase: RegisterBusinessUseCase;
  constructor() {
    const businessRepository = new TypeORMBusinessRepository();
    this.registerBusinessUseCase = new RegisterBusinessUseCase(
      businessRepository
    );
  }

  async registerBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { nit, name, description, address, userId } = req.body;

      const saveBusiness = await this.registerBusinessUseCase.save(
        nit,
        name,
        description,
        address,
        userId
      );

      res.status(200).json({ message: 'BUSINESS', saveBusiness });
    } catch (error: any) {
      console.log('Error al registrar el negocio', error);

      if (error.message.includes('ya registrado')) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }

  async updateBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nit, name, description, address } = req.body;

      if (!nit && !name && !description && !address) {
        res.status(400).json({
          message: 'Se debe proporcionar al menos un campo a actualizar',
        });
        return;
      }

      const updateBusiness = await this.registerBusinessUseCase.update(
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

  async deleteBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteBusiness = await this.registerBusinessUseCase.delete(id);

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
