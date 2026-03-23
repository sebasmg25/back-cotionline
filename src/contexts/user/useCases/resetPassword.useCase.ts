import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../domain/repositories/user.repository';
import { EnvConfig } from '../../shared/infraestructure/env/envConfig';

export class ResetPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const secret = (EnvConfig.get('JWT_RECOVERY_SECRET') || 'default_recovery') + user.password;

    try {
      jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.update(userId, {
      password: hashedPassword
    });

  }
}
