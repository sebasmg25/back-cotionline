import { User } from '../models/User';

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByIdentification(identification: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  // update(
  //   id: number,
  //   name: string,
  //   lastName: string,
  //   email: string,
  //   password: string,
  //   city: string
  // ): Promise<User | null>;
  // delete(id: string): Promise<User>;
}
