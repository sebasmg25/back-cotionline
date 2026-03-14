export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class Collaborator {
  public id?: string;
  public email: string;
  public invitationStatus: InvitationStatus;
  public userId: string;
  public createdAt: Date;
  

  constructor(
    email: string,
    invitationStatus: InvitationStatus,
    userId: string,
    createdAt: Date,
    id?: string,
  ) {
    ((this.email = email),
      (this.invitationStatus = invitationStatus),
      (this.userId = userId));
      this.createdAt = createdAt;
    this.id = id;
  }
}
