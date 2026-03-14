export enum NotificationType {
  TRANSACTIONAL = 'TRANSACTIONAL', // Solicitudes y Cotizaciones recibidas
  SYSTEM = 'SYSTEM', // Planes y Wompi
  TEAM = 'TEAM', // Colaboradores
}

export class Notification {
  public id?: string;
  public type: NotificationType;
  public title: string;
  public message: string;
  public link: string;
  public isRead: boolean;
  public createdAt: Date;
  public userId: string;

  constructor(
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    isRead: boolean,
    createdAt: Date,
    userId: string,
    id?: string,
  ) {
    this.type = type;
    this.title = title;
    this.message = message;
    this.link = link;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.userId = userId;
    this.id = id;
  }
}
