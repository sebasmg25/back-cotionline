import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';

export class GetCollaboratorsByUserIdUseCase {
  constructor(private collaboratorRepository: CollaboratorRepository) {}

  async execute(userIdSession: string): Promise<CollaboratorResponse[]> {
    // Buscamos directamente por el ID del dueño (confianza total en el token)
    const collaborators =
      await this.collaboratorRepository.findCollaboratorsByUserId(
        userIdSession,
      );

    // Filtramos para retornar PENDIENTES o RECHAZADAS
    const pendingInvitations = collaborators.filter(c => c.invitationStatus === 'PENDING' || c.invitationStatus === 'REJECTED');

    // Mapeamos la lista de modelos a DTOs
    return pendingInvitations.map((c) => ({
      id: c.id!,
      email: c.email,
      invitationStatus: c.invitationStatus,
      createdAt: c.createdAt,
      userId: c.userId,
    }));
  }
}
