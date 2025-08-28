export class QuotationRequest {
  public id?: string;
  public createdAt: Date;
  public responseDeadline: Date;
  public status: string;
  public branch: string;
  public userId: string;

  constructor(
    responseDeadline: Date,
    status: string,
    branch: string,
    userId: string,
    id?: string
  ) {
    this.createdAt = new Date();
    this.responseDeadline = responseDeadline;
    this.status = status;
    this.branch = branch;
    this.userId = userId;
    this.id = id;
  }
}
