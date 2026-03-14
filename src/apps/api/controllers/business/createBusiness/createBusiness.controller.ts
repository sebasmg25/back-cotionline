import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { RegisterBusinessUseCase } from '../../../../../contexts/business/useCases/registerBusiness.useCase';
import { CreateBusinessRequest } from '../../../../../contexts/business/interfaces/dtos/business.dto';

export class CreateBusinessController {
  constructor(private registerBusinessUseCase: RegisterBusinessUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      // 1. Extraemos el ID del usuario directamente del Token
      const userId = req.userSession!.id;

      // 2. Extraemos los campos de texto del body
      const { nit, name, description, address } = req.body;

      // 3. Procesamos los archivos (Multer)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const rutUrl = files?.['rut'] ? files['rut'][0].path : undefined;
      const chamberOfCommerceUrl = files?.['chamberOfCommerce']
        ? files['chamberOfCommerce'][0].path
        : undefined;

      // 4. Construimos el objeto de petición siguiendo la interfaz CreateBusinessRequest
      const businessData: CreateBusinessRequest = {
        nit,
        name,
        description,
        address,
        rutUrl,
        chamberOfCommerceUrl,
      };

      // 5. Ejecutamos el caso de uso pasando el ID de sesión seguro
      const savedBusiness = await this.registerBusinessUseCase.execute(
        businessData,
        userId,
      );

      res.status(201).json({
        message: 'Negocio registrado con éxito y en espera de verificación.',
        data: savedBusiness,
      });
    } catch (error: any) {
      // Sincronización exacta con el mensaje del Use Case
      if (error.message === 'Ya existe un negocio registrado con este nit') {
        res.status(409).json({ message: error.message });
        return;
      }

      console.error('[RegisterBusinessController] Error inesperado:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
