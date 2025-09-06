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

  static toDto(model: Business): BusinessDto {
    return new BusinessDto(
      model.nit,
      model.name,
      model.description,
      model.address,
      model.userId,
      model.id
    );
  }
}

// export class UpdateBusinessDto {
//   id: string;
//   nit?: string;
//   name?: string;
//   description?: string;
//   address?: string;
//   userId?: string;

//   constructor(
//     id: string,
//     nit?: string,
//     name?: string,
//     description?: string,
//     address?: string,
//     userId?: string
//   ) {
//     this.id = id;
//     this.nit = nit;
//     this.name = name;
//     this.description = description;
//     this.address = address;
//     this.userId = userId;
//   }

//   fromDto(): Business {
//     return new Business(
//       this.nit,
//       this.name,
//       this.description,
//       this.address,
//       this.userId,
//       this.id
//     );
//   }

//   static toDto(model: Business): UpdateBusinessDto {
//     return new UpdateBusinessDto(
//       model.id,
//       model.nit,
//       model.name,
//       model.description,
//       model.address
//     );
//   }
// }
