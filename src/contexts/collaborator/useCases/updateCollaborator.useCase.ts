import {
  CollaboratorRepository,
  CollaboratorUpdateFields,
} from '../domain/repositories/collaborator.repository';
import { CollaboratorResponse } from '../interfaces/dtos/collaborator.dto';

export class UpdateCollaboratorUseCase {
  constructor(private collaboratorRepository: CollaboratorRepository) {}

  async execute(
    id: string,
    userIdSession: string,
    email?: string,
  ): Promise<CollaboratorResponse> {
    const existCollaborator = await this.collaboratorRepository.findById(id);

    if (!existCollaborator) {
      throw new Error('El colaborador que intentas actualizar no existe');
    }

    if (existCollaborator.userId !== userIdSession) {
      throw new Error('No tienes permiso para modificar este colaborador.');
    }

    const updateFields: CollaboratorUpdateFields = {};
    if (email !== undefined && email !== existCollaborator.email) {
      updateFields.email = email;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No se detectaron cambios en los campos enviados.');
    }

    const updated = await this.collaboratorRepository.update(id, updateFields);
    if (!updated) throw new Error('Error al actualizar el colaborador.');

    return {
      id: updated.id!,
      email: updated.email,
      invitationStatus: updated.invitationStatus,
      createdAt: updated.createdAt,
      userId: updated.userId,
    };
  }
}
