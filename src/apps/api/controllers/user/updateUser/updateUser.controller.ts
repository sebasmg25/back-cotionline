import { Response } from 'express';
import { UpdateUserUseCase } from '../../../../../contexts/user/useCases/updateUser.useCase';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateUserRequest } from '../../../../../contexts/user/interfaces/dtos/user.dto';

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userIdSession = req.userSession?.id;

      if (!userIdSession) {
        res.status(401).json({ message: 'Sesión no válida o expirada.' });
        return;
      }

      const updateData: UpdateUserRequest = {
        name: req.body.name,
        lastName: req.body.lastName,
        department: req.body.department, // Campo capturado
        city: req.body.city,
        password: req.body.password,
      };

      const updatedUser = await this.updateUserUseCase.execute(
        userIdSession,
        updateData,
      );

      res.status(200).json({
        message: 'Perfil actualizado exitosamente.',
        data: updatedUser,
      });
    } catch (error: any) {
      const errorMessage = error.message;

      if (errorMessage.includes('no existe')) {
        res.status(404).json({ message: errorMessage });
        return;
      }

      // Añadimos el blindaje para errores geográficos
      if (
        errorMessage.includes('No se detectaron cambios') ||
        errorMessage.includes('igual a la anterior') ||
        errorMessage.includes('no es válido') ||
        errorMessage.includes('no pertenece al departamento')
      ) {
        res.status(400).json({ message: errorMessage });
        return;
      }

      const safeErrorMessage = errorMessage.replaceAll(/[\r\n]/g, '');
      console.error('[UpdateUserController] Error:', safeErrorMessage);
      res
        .status(500)
        .json({ message: 'Error interno al actualizar el perfil.' });
    }
  }
}
