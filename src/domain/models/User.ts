export class User {
  public identification: string;
  public name: string;
  public lastName: string;
  public email: string;
  public password: string;
  public city: string;

  constructor(
    identification: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    city: string
  ) {
    this.identification = identification;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.city = city;
  }

  // register() {}

  // updateData() {}

  // login() {}

  // changePassword() {}

  // find() {}
}
