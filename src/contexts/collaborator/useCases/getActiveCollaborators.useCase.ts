import { UserRepository } from '../../user/domain/repositories/user.repository';
import { User } from '../../user/domain/models/user.model';

export class GetActiveCollaboratorsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(ownerId: string): Promise<Omit<User, 'password'>[]> {
    const collaborators = await this.userRepository.findCollaboratorsByOwnerId(ownerId);
    
    return collaborators.map((c) => {
      const { password, ...safeUser } = c;
      return safeUser as Omit<User, 'password'>;
    });
  }
}
