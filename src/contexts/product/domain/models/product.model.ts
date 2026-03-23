export class Product {
  public id?: string;
  public name: string;
  public amount: number;
  public unitOfMeasurement: string;
  public description: string;
  public quotationRequestId: string;

  constructor(
    name: string,
    amount: number,
    unitOfMeasurement: string,
    description: string,
    quotationRequestId: string,
    id?: string,
  ) {
    ((this.name = name),
      (this.amount = amount),
      (this.unitOfMeasurement = unitOfMeasurement),
      (this.description = description),
      (this.quotationRequestId = quotationRequestId));
    this.id = id;
  }
}
