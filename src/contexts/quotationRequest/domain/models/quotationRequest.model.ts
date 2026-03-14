import { Product } from '../../../product/domain/models/product.model';

export enum QuotationRequestStatus {
  DRAFT = 'DRAFT', // Nuevo: El usuario está editando, nadie más la ve.
  PENDING = 'PENDING', // Nadie ha cotizado.
  QUOTED = 'QUOTED', // Hay ofertas, pero el tiempo sigue corriendo.
  EXPIRED = 'EXPIRED', // Se acabó el tiempo y NO se cerró el trato.
  CLOSED = 'CLOSED', // Éxito: Se eligió a un proveedor.
}
export class QuotationRequest {
  public id?: string;
  public title: string;
  public description: string;
  public createdAt: Date;
  public responseDeadline: Date;
  public status: QuotationRequestStatus;
  public branch: string;
  public userId: string;
  public products?: Product[];

  constructor(
    title: string,
    description: string,
    responseDeadline: Date,
    status: QuotationRequestStatus,
    branch: string,
    userId: string,
    id?: string,
    products?: Product[],
    createdAt?: Date,
  ) {
    this.title = title;
    this.description = description;
    this.createdAt = createdAt ?? new Date();
    this.responseDeadline = responseDeadline;
    this.status = status;
    this.branch = branch;
    this.userId = userId;
    this.id = id;
    this.products = products;
  }
}
