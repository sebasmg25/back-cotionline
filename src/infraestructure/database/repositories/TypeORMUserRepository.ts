import { Repository } from 'typeorm';
import { User } from '../../../domain/models/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { AppDataSource } from '../../../config/database';
import { UserEntity } from '../entities/UserEntity';
const bcrypt = require('bcrypt');

export class TypeORMCustomerRepository implements UserRepository {
  private ormRepository: Repository<UserEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userToSave = this.ormRepository.create({
      ...user,
      password: hashedPassword,
    });

    const savedEntity = await this.ormRepository.save(userToSave);
    console.log('USUARIO', savedEntity);

    return new User(
      savedEntity.identification,
      savedEntity.name,
      savedEntity.lastName,
      savedEntity.email,
      savedEntity.password,
      savedEntity.city
    );
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({
      where: { id },
    });
    if (!userEntity) {
      return null;
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city
    );
  }

  async findByIdentification(identification: string): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({
      where: { identification },
    });
    if (!userEntity) {
      return null;
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({ where: { email } });
    if (!userEntity) {
      return null;
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city
    );
  }

  // async update(
  //   id: number,
  //   name: string,
  //   lastName: string,
  //   email: string,
  //   password: string,
  //   city: string
  // ): Promise<User | null> {
  //   const existUser = await this.ormRepository.findOne({ where: { id } });
  //   if (!existUser) {
  //     return null;
  //   }
  //   const userEntity = await this.ormRepository.update(id, {
  //     name: name,
  //     lastName: lastName,
  //     email: email,
  //     password: password,
  //     city: city,
  //   });
  //   return new User(
  //     userEntity.identification,
  //     userEntity.name,
  //     userEntity.lastName,
  //     userEntity.email,
  //     userEntity.password,
  //     userEntity.city
  //   );
  // }

  // delete(id: string): Promise<User> {}
}
