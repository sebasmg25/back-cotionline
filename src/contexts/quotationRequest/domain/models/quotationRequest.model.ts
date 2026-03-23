import { Product } from '../../../product/domain/models/product.model';

export enum QuotationRequestStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  QUOTED = 'QUOTED',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
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
