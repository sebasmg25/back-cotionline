import { Request, Response } from 'express';
import { RegisterBusinessUseCase } from '../../../../../contexts/business/useCases/registerBusiness.useCase';
import { TypeORMBusinessRepository } from '../../../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';
import { BusinessDto } from '../../../../../contexts/business/interfaces/dtos/business.dto';

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

      const businessData = new BusinessDto(
        nit,
        name,
        description,
        address,
        userId
      );

      const saveBusiness = await this.registerBusinessUseCase.save(
        businessData
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
}
