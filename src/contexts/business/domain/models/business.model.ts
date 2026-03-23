export enum BusinessStatus {
  PENDING = 'PENDIENTE',
  VERIFIED = 'VERIFICADO',
  RECHAZADO = 'RECHAZADO',
}

export class Business {
  public id?: string;
  public nit: string;
  public name: string;
  public description: string;
  public address: string;
  public userId: string;
  public status: BusinessStatus;
  public rutUrl?: string;
  public chamberOfCommerceUrl?: string;

  constructor(
    nit: string,
    name: string,
    description: string,
    address: string,
    userId: string,
    status: BusinessStatus,
    rutUrl?: string,
    chamberOfCommerceUrl?: string,
    id?: string,
  ) {
    this.nit = nit;
    this.name = name;
    this.description = description;
    this.address = address;
    this.userId = userId;
    this.status = status;
    this.rutUrl = rutUrl;
    this.chamberOfCommerceUrl = chamberOfCommerceUrl;
    this.id = id;
  }
}
