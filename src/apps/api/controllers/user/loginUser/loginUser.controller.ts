import { Request, Response } from 'express';
import { LoginUserUseCase } from '../../../../../contexts/user/useCases/loginUser.useCase';

export class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // 1. Ejecución del caso de uso (autenticación y generación de token)
      const result = await this.loginUserUseCase.execute(email, password);

      // 2. Respuesta exitosa con el DTO y el JWT
      res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        data: result,
      });
    } catch (error: any) {
      const errorMessage = error.message;

      // 3. Blindaje: Error 401 para credenciales incorrectas (no da pistas)
      if (errorMessage.includes('inválidas')) {
        res.status(401).json({ message: errorMessage });
        return;
      }

      console.error('[LoginUserController] Error:', errorMessage);
      res.status(500).json({
        message: 'Error interno al intentar iniciar sesión.',
      });
    }
  }
}
