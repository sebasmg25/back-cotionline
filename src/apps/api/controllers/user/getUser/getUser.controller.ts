import { Response } from 'express';
import { GetUserUseCase } from '../../../../../contexts/user/useCases/getUser.useCase';
import { AuthRequest } from '../../../middlewares/jwtVerifier';

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      // 1. BLINDAJE: Extraemos el ID de la sesión, no de los parámetros de la URL
      const userIdSession = req.userSession?.id;

      if (!userIdSession) {
        res.status(401).json({ message: 'No autorizado. Sesión inválida.' });
        return;
      }

      // 2. El caso de uso ya devuelve el DTO (UserResponse) sin contraseña
      const user = await this.getUserUseCase.execute(userIdSession);

      res.status(200).json({
        message: 'Perfil obtenido exitosamente.',
        data: user, // Ya viene limpio desde el UseCase
      });
    } catch (error: any) {
      const errorMessage = error.message;

      if (errorMessage.includes('no encontrado')) {
        res.status(404).json({ message: errorMessage });
        return;
      }

      console.error('[GetUserController] Error:', errorMessage);
      res.status(500).json({ message: 'Error interno al obtener el perfil.' });
    }
  }
}
