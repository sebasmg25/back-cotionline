import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../../../contexts/user/useCases/registerUser.useCase';
import { TypeORMUserRepository } from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';
import { RegisterUserRequestDto } from '../../../../../contexts/user/interfaces/dtos/registerUserRequest.dto';
import { UserResponseDto } from '../../../../../contexts/user/interfaces/dtos/userResponse.dto';

export class CreateUserController {
  private registerUserUseCase: RegisterUserUseCase;

  constructor() {
    const userRepository = new TypeORMUserRepository();
    this.registerUserUseCase = new RegisterUserUseCase(userRepository);
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterUserRequestDto = req.body;

      // Validación básica de campos requeridos del DTO de entrada
      if (
        !userData.identification ||
        !userData.name ||
        !userData.lastName ||
        !userData.email ||
        !userData.password ||
        !userData.city
      ) {
        res.status(400).json({ message: 'Todos los campos son requeridos.' });
        return;
      }

      // Llama al servicio de dominio para registrar el usuario
      const newUser = await this.registerUserUseCase.saveUser(
        userData.identification,
        userData.name,
        userData.lastName,
        userData.email,
        userData.password,
        userData.city
      );

      // Mapea el modelo de dominio a un DTO de Salida
      const userResponseData: UserResponseDto = {
        id: newUser.id!,
        identification: newUser.identification,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        city: newUser.city,
      };

      // Envía la respuesta exitosa con el DTO de salida
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: userResponseData, // Asegura que el DTO se adjunta directamente al campo 'user'
      });
    } catch (error: any) {
      console.error('Error al registrar el usuario:', error); // Usar console.error para errores

      // Manejo de errores específicos con códigos de estado HTTP adecuados
      if (
        error.message.includes('ya registrado') ||
        error.message.includes('ya existe')
      ) {
        // Unicidad (Email o Identificación ya existen)
        res.status(409).json({ message: error.message }); // 409 Conflict
      } else if (
        error.message.includes('formato de correo es invalido') ||
        error.message.includes('contraseña supera el máximo') ||
        error.message.includes(
          'contraseña debe contener al menos una letra mayúscula'
        ) ||
        error.message.includes('contraseña debe contener al menos un número') ||
        error.message.includes(
          'contraseña debe contener al menos un caracter especial'
        )
      ) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
      } else {
        // Errores inesperados o no capturados
        res.status(500).json({
          message: 'Error interno del servidor al registrar el usuario.',
        });
      }
    }
  }
}
