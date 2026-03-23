export enum UserRole {
  OWNER = 'OWNER',
  COLLABORATOR = 'COLLABORATOR',
}

export class User {
  public identification: string;
  public name: string;
  public lastName: string;
  public email: string;
  public password: string;
  public department: string;
  public city: string;
  public id?: string;
  public planId?: string;
  public planStartDate?: Date;
  public role: UserRole;
  public ownerId?: string;

  constructor(
    identification: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    department: string,
    city: string,
    id?: string,
    planId?: string,
    planStartDate?: Date,
    role: UserRole = UserRole.OWNER,
    ownerId?: string,
  ) {
    this.identification = identification;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.department = department;
    this.city = city;
    this.id = id;
    this.planId = planId;
    this.planStartDate = planStartDate;
    this.role = role;
    this.ownerId = ownerId;
  }
}
