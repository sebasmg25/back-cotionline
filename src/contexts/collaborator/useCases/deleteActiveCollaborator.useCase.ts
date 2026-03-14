import { UserRepository } from '../../user/domain/repositories/user.repository';
import { UserRole } from '../../user/domain/models/user.model';
import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';

export class DeleteActiveCollaboratorUseCase {
  constructor(
    private userRepository: UserRepository,
    private collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute(collaboratorId: string, ownerIdSession: string): Promise<void> {
    const user = await this.userRepository.findById(collaboratorId);

    if (!user) {
      throw new Error('El colaborador no existe.');
    }

    if (user.role !== UserRole.COLLABORATOR || user.ownerId !== ownerIdSession) {
      // Por seguridad, si intentan borrar a un dueño o a un colaborador que no les pertenece
      throw new Error('No tienes permisos para eliminar este colaborador o el usuario no es de tu propiedad.');
    }

    // Buscamos la invitación original por email para también eliminarla y liberar el cupo del plan
    const collaboratorInvitation = await this.collaboratorRepository.findByEmail(user.email);
    if (collaboratorInvitation) {
      await this.collaboratorRepository.delete(collaboratorInvitation.id!);
    }

    // Eliminamos el usuario directamente
    const deleted = await this.userRepository.delete(collaboratorId);
    if (!deleted) {
      throw new Error('Error al intentar eliminar el colaborador.');
    }
  }
}
