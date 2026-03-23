import { Collaborator, InvitationStatus } from '../models/collaborator.model';

export interface CollaboratorUpdateFields {
  email?: string;
  invitationStatus?: InvitationStatus;
}

export interface CollaboratorRepository {
  save(collaborator: Collaborator): Promise<Collaborator>;
  findByEmail(email: string): Promise<Collaborator | null>;
  findById(id: string): Promise<Collaborator | null>;
  update(
    id: string,
    collaboratorUpdateFields: CollaboratorUpdateFields,
  ): Promise<Collaborator | null>;
  delete(id: string): Promise<Collaborator | null>;
  countByUserId(userId: string): Promise<number>;
  findCollaboratorsByUserId(userId: string): Promise<Collaborator[]>;
}
