import { InvitationStatus } from '../domain/models/collaborator.model';
import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationType } from '../../notification/domain/models/notification.model';

export class RejectInvitationUseCase {
  constructor(
    private collaboratorRepository: CollaboratorRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  async execute(collaboratorId: string): Promise<CollaboratorResponse> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);

    if (!collaborator) throw new Error('Invitación no encontrada');

    if (collaborator.invitationStatus === InvitationStatus.ACCEPTED) {
      throw new Error('Esta invitación ya ha sido aceptada anteriormente');
    }

    const updated = await this.collaboratorRepository.update(collaboratorId, {
      invitationStatus: InvitationStatus.REJECTED,
    });

    if (!updated)
      throw new Error('No se pudo actualizar el estado de la invitación');

    await this.sendNotificationUseCase.execute(
      NotificationType.TEAM,
      'Invitación Rechazada',
      `El colaborador con correo ${collaborator.email} ha rechazado unirse a tu equipo.`,
      '/dashboard/collaborators',
      collaborator.userId,
    );

    return {
      id: updated.id!,
      email: updated.email,
      invitationStatus: updated.invitationStatus,
      createdAt: updated.createdAt,
      userId: updated.userId,
    };
  }
}
