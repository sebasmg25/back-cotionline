import { User } from '../../domain/models/user.model';

export class UserResponseDto {
  id?: string;
  identification: string;
  name: string;
  lastName: string;
  email: string;
  city: string;
  password?: string;

  constructor(
    id: string | undefined,
    identification: string,
    name: string,
    lastName: string,
    email: string,
    city: string,
    password?: string
  ) {
    this.id = id;
    this.identification = identification;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.city = city;
    this.password = password;
  }

  // Desde DTO - sale un Modelo
  fromDto(): User {
    return new User(
      this.identification,
      this.name,
      this.lastName,
      this.email,
      this.password ?? '',
      this.city
    );
  }

  // A DTO entra modelo - sale DTO
  static toDto(model: User): UserResponseDto {
    return new UserResponseDto(
      model.id,
      model.identification,
      model.name,
      model.lastName,
      model.email,
      model.city
    );
  }
}
