import { Business } from '../../domain/models/business.model';

export class BusinessDto {
  id?: string;
  nit: string;
  name: string;
  description: string;
  address: string;
  userId: string;

  constructor(
    nit: string,
    name: string,
    description: string,
    address: string,
    userId: string,
    id?: string | undefined
  ) {
    this.nit = nit;
    this.name = name;
    this.description = description;
    this.address = address;
    this.userId = userId;
    this.id = id;
  }

  fromDto(): Business {
    return new Business(
      this.nit,
      this.name,
      this.description,
      this.address,
      this.userId
    );
  }

  toDto(model: Business): BusinessDto {
    return new BusinessDto(
      this.nit,
      this.name,
      this.description,
      this.address,
      this.userId,
      this.id
    );
  }
}
