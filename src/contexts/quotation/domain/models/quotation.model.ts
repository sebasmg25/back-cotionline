export enum QuotationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

export class Quotation {
  public id?: string;
  public issueDate: Date;
  public responseDeadline: Date;
  public price: number;
  public deliveryTime: Date;
  public description?: string;
  public quotationRequestId: string;
  public userId: string;
  public status: QuotationStatus;
  public individualValues?: any[];
  public businessName?: string;

  constructor(
    responseDeadline: Date,
    quotationRequestId: string,
    userId: string,
    price: number,
    deliveryTime: Date,
    status: QuotationStatus,
    description?: string,
    individualValues?: any[],
    id?: string,
    issueDate?: Date,
  ) {
    this.issueDate = issueDate || new Date();
    this.responseDeadline = responseDeadline;
    this.quotationRequestId = quotationRequestId;
    this.userId = userId;
    this.price = price;
    this.deliveryTime = deliveryTime;
    this.status = status;
    this.description = description;
    this.individualValues = individualValues;
    this.id = id;
  }
}
