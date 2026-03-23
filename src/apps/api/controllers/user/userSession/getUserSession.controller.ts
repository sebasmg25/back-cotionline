import { Response } from 'express';
import { GetUserUseCase } from '../../../../../contexts/user/useCases/getUser.useCase';
import { CheckPlanExpirationUseCase } from '../../../../../contexts/subscription/useCases/checkPlanExpiration.useCase';
import { AuthRequest } from '../../../middlewares/jwtVerifier';

export class GetUserSessionController {
  constructor(
    private getUserUseCase: GetUserUseCase,
    private checkPlanExpirationUseCase: CheckPlanExpirationUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {

      const userIdSession = req.userSession?.id;

      if (!userIdSession) {
        res.status(401).json({
          message: 'Token válido pero no se encontró la identidad del usuario.',
        });
        return;
      }


      
      try {
        await this.checkPlanExpirationUseCase.execute(userIdSession);
      } catch (planError: any) {
        console.error(
          '[GetUserSessionController] Error no crítico en plan:',
          planError.message,
        );
      }

      const user = await this.getUserUseCase.execute(userIdSession);
      
      res.status(200).json({
        message: 'Sesión recuperada con éxito.',
        data: { user },
      });
    } catch (error: any) {
      const errorMessage = error.message;
      console.error('[GetUserSessionController] Error Crítico:', errorMessage);

      if (errorMessage.includes('no encontrado')) {
        res.status(404).json({ message: errorMessage });
        return;
      }

      res.status(500).json({
        message: 'Error interno al validar la sesión activa.',
      });
    }
  }
}
