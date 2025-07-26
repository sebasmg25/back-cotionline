import { Request, Response } from 'express';
import { UserService } from '../../../domain/services/UserService';
import { TypeORMUserRepository } from '../../../infraestructure/database/repositories/TypeORMUserRepository';
import { JwtTokenService } from '../../security/JwtTokenService';

import {LoginRequestDto} from '../../../Dtos/User/LoginRequestDto';
import {UserResponseDto} from '../../../Dtos/User/UserResponseDto';
import {LoginResponseDto} from '../../../Dtos/User/LoginResponseDto';


export class UserController {
  private userService: UserService;
  constructor() {
    const userRepository = new TypeORMUserRepository();
    const tokenGenerator = new JwtTokenService();
    this.userService = new UserService(userRepository, tokenGenerator);
    
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

  async login(req: Request<any, any, LoginRequestDto>, res: Response): Promise<void> {
    try{
      const {email, password} = req.body;

      if(!email || !password){
        res.status(400).json({message: 'Se requiere correo electrónico y contraseña.'});
        return;  
      }
      const result = await this.userService.login(email, password);

      const userResponse = new UserResponseDto(
        result.user.id,
        result.user.identification,
        result.user.name,
        result.user.lastName,
        result.user.email,
        result.user.city
      );
      const loginResponse = new LoginResponseDto ('Inicio de sesión exitoso.', userResponse, result.token);
      res.status(200).json(loginResponse);

    }
    catch (error: any){
      if(error.message.includes('inválidas') || error.message.includes('inválidas')){
      res.status(401).json({message: error.message});
      }else{
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json({message: 'Error interno del servidor.'});
      }
    }
  }
}
