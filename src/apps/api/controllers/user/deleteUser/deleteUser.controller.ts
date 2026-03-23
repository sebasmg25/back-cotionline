import { Response } from 'express';
import { DeleteUserUseCase } from '../../../../../contexts/user/useCases/deleteUser.useCase';
import { AuthRequest } from '../../../middlewares/jwtVerifier';

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}


  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {

      const userIdSession = req.userSession?.id;

      if (!userIdSession) {
        res.status(401).json({ message: 'Sesión no válida o expirada.' });
        return;
      }

      await this.deleteUserUseCase.execute(userIdSession);

      res.status(200).json({
        message:
          'Tu cuenta y todos los datos relacionados han sido eliminados con éxito.',
      });
    } catch (error: any) {
      const errorMessage = error.message;


      if (
        errorMessage.includes('no encontrado') ||
        errorMessage.includes('permiso')
      ) {
        res.status(404).json({ message: errorMessage });
        return;
      }

      console.error('[DeleteUserController] Error:', errorMessage);
      res
        .status(500)
        .json({ message: 'Error interno al intentar eliminar la cuenta.' });
    }
  }
}
