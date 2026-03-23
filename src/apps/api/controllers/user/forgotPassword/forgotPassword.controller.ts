import { Request, Response } from 'express';
import { RequestPasswordResetUseCase } from '../../../../../contexts/user/useCases/requestPasswordReset.useCase';

export class ForgotPasswordController {
  constructor(private requestPasswordResetUseCase: RequestPasswordResetUseCase) {}

  async handle(req: Request, res: Response) {
    const { email } = req.body;

    try {
      await this.requestPasswordResetUseCase.execute(email);
    
      return res.status(200).json({ 
        message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña pronto.' 
      });
    } catch (error: any) {
      console.error('Error en ForgotPasswordController:', error);
      return res.status(500).json({ message: 'Hubo un error al procesar tu solicitud' });
    }
  }
}
