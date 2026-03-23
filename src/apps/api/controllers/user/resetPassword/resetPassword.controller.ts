import { Request, Response } from 'express';
import { ResetPasswordUseCase } from '../../../../../contexts/user/useCases/resetPassword.useCase';

export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

  async handle(req: Request, res: Response) {
    const { userId, token, newPassword } = req.body;

    try {
      await this.resetPasswordUseCase.execute(userId, token, newPassword);
      return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error: any) {
      console.error('Error en ResetPasswordController:', error);
      const status = error.message === 'Token inválido o expirado' ? 401 : 400;
      return res.status(status).json({ message: error.message || 'Error al restablecer la contraseña' });
    }
  }
}
