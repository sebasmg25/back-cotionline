export enum PaymentStatus {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADO',
  DECLINED = 'RECHAZADO',
  VOIDED = 'ANULADO',
  ERROR = 'ERROR',
}

export class PaymentTransaction {
  public id: string;
  public userId: string;
  public planId: string;
  public amount: number;
  public status: PaymentStatus;
  public wompiId?: string;
  public createdAt?: Date;

  constructor(
    id: string,
    userId: string,
    planId: string,
    amount: number,
    status: PaymentStatus,
    wompiId?: string,
    createdAt?: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.planId = planId;
    this.amount = amount;
    this.status = status;
    this.wompiId = wompiId;
    this.createdAt = createdAt;
  }
}
