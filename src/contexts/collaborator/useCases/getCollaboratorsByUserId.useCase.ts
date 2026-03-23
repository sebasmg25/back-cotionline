import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';

export class GetCollaboratorsByUserIdUseCase {
  constructor(private collaboratorRepository: CollaboratorRepository) {}

  async execute(userIdSession: string): Promise<CollaboratorResponse[]> {
    const collaborators =
      await this.collaboratorRepository.findCollaboratorsByUserId(
        userIdSession,
      );
    const pendingInvitations = collaborators.filter(c => c.invitationStatus === 'PENDING' || c.invitationStatus === 'REJECTED');

    return pendingInvitations.map((c) => ({
      id: c.id!,
      email: c.email,
      invitationStatus: c.invitationStatus,
      createdAt: c.createdAt,
      userId: c.userId,
    }));
  }
}
