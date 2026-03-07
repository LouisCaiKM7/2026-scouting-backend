import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Role, User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async isUserExistByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email });
  }

  async getUserRoleByEmail(email: string): Promise<Role[] | undefined> {
    const user = await this.userRepository.findOneBy({ email });
    return user?.roles;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findOne(options: FindOneOptions<User>): Promise<User | undefined> {
    const user = await this.userRepository.findOne(options);
    return user || undefined;
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    roles: Role[],
  ): Promise<User> {
    const user = this.userRepository.create({
      name,
      email,
      password,
      roles,
    });
    return await this.userRepository.save(user);
  }
}
