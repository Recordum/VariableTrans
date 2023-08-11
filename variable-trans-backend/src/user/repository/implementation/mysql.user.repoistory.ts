import { User } from 'src/user/entity/user.entity';
import { UserRepository } from '../user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MySqlUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}
  public async save(user: User): Promise<void> {
    await this.repository.save(user);
  }

  public async findUserByEmail(userEmail: string): Promise<User> {
    return await this.repository.findOne({
      where: { userEmail: userEmail },
    });
  }

  public async findUserById(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { Id: id },
    });
  }
}
