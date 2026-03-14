import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../../../contexts/user/useCases/registerUser.useCase';
import { CreateUserRequest } from '../../../../../contexts/user/interfaces/dtos/user.dto';

export class CreateUserController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      // 1. Extraemos los datos del body
      const signupData: CreateUserRequest = {
        identification: req.body.identification,
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        department: req.body.department, // Agregado
        city: req.body.city,
      };

      // 2. Ejecutamos el caso de uso
      const result = await this.registerUserUseCase.execute(signupData);

      // 3. Respuesta exitosa (201 Created)
      res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        data: result,
      });
    } catch (error: any) {
      const errorMessage = error.message;

      // Blindaje: Manejo de conflictos (Usuarios duplicados) - 409
      if (errorMessage.includes('Ya existe')) {
        res.status(409).json({ message: errorMessage });
        return;
      }

      // Blindaje: Errores de validación geográfica (Coherencia Dept/Ciudad) - 400
      if (
        errorMessage.includes('no es válido') ||
        errorMessage.includes('no pertenece al departamento')
      ) {
        res.status(400).json({ message: errorMessage });
        return;
      }

      // Blindaje: Errores de configuración del sistema - 500
      if (errorMessage.includes('plan inicial')) {
        res.status(500).json({
          message:
            'El sistema no está disponible para registros en este momento.',
        });
        return;
      }

      const safeErrorMessage = errorMessage.replaceAll(/[\r\n]/g, '');
      console.error('[CreateUserController] Error:', safeErrorMessage);
      res.status(500).json({
        message: 'Error interno del servidor al procesar el registro.',
      });
    }
  }
}
