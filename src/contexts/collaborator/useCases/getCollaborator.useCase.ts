import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';

export class GetCollaboratorUseCase {
  constructor(private collaboratorRepository: CollaboratorRepository) {}

  async execute(
    collaboratorId: string,
    userIdSession: string,
  ): Promise<CollaboratorResponse> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);

    if (!collaborator) {
      throw new Error('Colaborador no encontrado.');
    }

    // SEGURIDAD: Solo el dueño que lo invitó puede ver sus detalles
    if (collaborator.userId !== userIdSession) {
      throw new Error('No tienes permiso para ver este colaborador.');
    }

    return {
      id: collaborator.id!,
      email: collaborator.email,
      invitationStatus: collaborator.invitationStatus,
      createdAt: collaborator.createdAt,
      userId: collaborator.userId,
    };
  }
}
