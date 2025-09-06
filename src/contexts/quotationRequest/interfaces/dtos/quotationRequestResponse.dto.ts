import { QuotationRequest } from '../../domain/models/quotationRequest.model';

export class QuotationRequestDto {
  public responseDeadline: Date;
  public status: string;
  public branch: string;
  public userId: string;

  constructor(
    responseDeadline: Date,
    status: string,
    branch: string,
    userId: string
  ) {
    this.responseDeadline = responseDeadline;
    this.status = status;
    this.branch = branch;
    this.userId = userId;
  }

  fromDto(): QuotationRequest {
    return new QuotationRequest(
      this.responseDeadline,
      this.status,
      this.branch,
      this.userId
    );
  }
}

export class QuotationRequestResponseDto {
  public id: string;
  public createdAt: Date;
  public responseDeadline: Date;
  public status: string;
  public branch: string;
  public userId: string;

  constructor(
    id: string,
    createdAt: Date,
    responseDeadline: Date,
    status: string,
    branch: string,
    userId: string
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.responseDeadline = responseDeadline;
    this.status = status;
    this.branch = branch;
    this.userId = userId;
  }

  static toDto(model: QuotationRequest): QuotationRequestResponseDto {
    return new QuotationRequestResponseDto(
      model.id as string,
      model.createdAt,
      model.responseDeadline,
      model.status,
      model.branch,
      model.userId
    );
  }
}

// export class UpdateQuotationRequestDto {
//   public id?: string;
//   public responseDeadline?: Date;
//   public status?: string;
//   public branch?: string;

//   constructor(
//     id?: string,
//     responseDeadline?: Date,
//     status?: string,
//     branch?: string
//   ) {
//     this.id = id;
//     this.responseDeadline = responseDeadline;
//     this.status = status;
//     this.branch = branch;
//   }

//   fromDto(): QuotationRequest {
//     return new QuotationRequest(
//       this.id,
//       this.responseDeadline,
//       this.status,
//       this.branch
//     );
//   }

//   static toDto(model: QuotationRequest): UpdateQuotationRequestDto {
//     return new UpdateQuotationRequestDto(
//       model.responseDeadline,
//       model.status,
//       model.branch
//     );
//   }
// }
