import jwt from 'jsonwebtoken';
import { UserRepository } from '../domain/repositories/user.repository';
import { EmailService } from '../../shared/infraestructure/email/nodemailer.service';
import { EnvConfig } from '../../shared/infraestructure/env/envConfig';

export class RequestPasswordResetUseCase {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }
    const secret = (EnvConfig.get('JWT_RECOVERY_SECRET') || 'default_recovery') + user.password;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '15m' }
    );

    await this.emailService.sendPasswordResetEmail(user.email, token, user.id!);
  }
}
