import { InvitationStatus } from '../domain/models/collaborator.model';
import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationType } from '../../notification/domain/models/notification.model';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';

export class AcceptInvitationUseCase {
  constructor(
    private collaboratorRepository: CollaboratorRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  async execute(collaboratorId: string): Promise<CollaboratorResponse> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);

    if (!collaborator) {
      throw new Error('Invitación no encontrada');
    }

    if (collaborator.invitationStatus === 'ACCEPTED') {
      throw new Error('Esta invitación ya ha sido aceptada anteriormente');
    }

    const updatedCollaborator = await this.collaboratorRepository.update(
      collaboratorId,
      { invitationStatus: InvitationStatus.ACCEPTED },
    );

    if (!updatedCollaborator) {
      throw new Error('No se pudo actualizar el estado de la invitación');
    }

    await this.sendNotificationUseCase.execute(
      NotificationType.TEAM,
      'Invitación Aceptada',
      `El colaborador con correo ${collaborator.email} ha aceptado unirse a tu equipo.`,
      '/dashboard/collaborators',
      collaborator.userId,
    );

    return {
      id: updatedCollaborator.id!,
      email: updatedCollaborator.email,
      invitationStatus: updatedCollaborator.invitationStatus,
      createdAt: updatedCollaborator.createdAt,
      userId: updatedCollaborator.userId,
    };
  }
}
