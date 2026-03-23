import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';

export class DeleteCollaboratorUseCase {
  constructor(private collaboratorRepository: CollaboratorRepository) {}

  async execute(
    collaboratorId: string,
    userIdSession: string,
  ): Promise<CollaboratorResponse> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);

    if (!collaborator) throw new Error('Colaborador no encontrado.');

    if (collaborator.userId !== userIdSession) {
      throw new Error('No tienes permiso para eliminar este colaborador.');
    }

    await this.collaboratorRepository.delete(collaboratorId);

    return {
      id: collaborator.id!,
      email: collaborator.email,
      invitationStatus: collaborator.invitationStatus,
      createdAt: collaborator.createdAt,
      userId: collaborator.userId,
    };
  }
}
