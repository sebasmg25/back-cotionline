
export class UserResponseDto {
  id?: string; 
  identification: string;
  name: string;
  lastName: string;
  email: string;
  city: string;

  constructor(
    id: string | undefined,
    identification: string,
    name: string,
    lastName: string,
    email: string,
    city: string
  ) {
    this.id = id;
    this.identification = identification;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.city = city;
  }
}