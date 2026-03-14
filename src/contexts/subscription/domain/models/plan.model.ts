export enum PlanName {
  FREE = 'GRATUITO',
  BASIC = 'BASICO',
  PREMIUM = 'PREMIUM',
}

export class Plan {
  public id: string;
  public name: PlanName;
  public price: number;
  public requestLimit: number;
  public quotationLimit: number;
  public collaboratorLimit: number;

  constructor(
    id: string,
    name: PlanName,
    price: number,
    requestLimit: number,
    quotationLimit: number,
    collaboratorLimit: number,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.requestLimit = requestLimit;
    this.quotationLimit = quotationLimit;
    this.collaboratorLimit = collaboratorLimit;
  }
}
