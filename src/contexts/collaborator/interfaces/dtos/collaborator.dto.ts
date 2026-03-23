import { InvitationStatus } from '../../domain/models/collaborator.model';

export interface CreateCollaboratorRequest {
  email: string;
}

export interface CollaboratorResponse {
  id: string;
  email: string;
  invitationStatus: InvitationStatus;
  createdAt: Date;
  userId: string;
}
