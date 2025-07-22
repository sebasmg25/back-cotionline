import { Request, Response } from 'express';
import { UserService } from '../../../domain/services/UserService';
import { TypeORMUserRepository } from '../../../infraestructure/database/repositories/TypeORMUserRepository';

export class UserController {
  private userService: UserService;
  constructor() {
    const userRepository = new TypeORMUserRepository();
    this.userService = new UserService(userRepository);
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { identification, name, lastName, email, password, city } =
        req.body;
      if (
        !identification ||
        !name ||
        !lastName ||
        !email ||
        !password ||
        !city
      ) {
        res.status(400).json({ message: 'Todos los campos son requeridos' });
        return;
      }

      const newUser = await this.userService.saveUser(
        identification,
        name,
        lastName,
        email,
        password,
        city
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          city: newUser.city,
        },
      });
    } catch (error: any) {
      console.log('Error al registrar el usuario:', error);
      if (error.message.includes('ya registrado')) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error interno del servidor al registrar el usuario.',
        });
      }
    }
  }
}
