import { User } from '../../entity/user.entity';
import { UserRepository } from '../user.repository';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MySqlUserRepository
  extends Repository<User>
  implements UserRepository
{
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  public async updateRequestLimit(
    id: string,
    requestLimit: number,
  ): Promise<void> {
    await this.update(id, { requestLimit: requestLimit });
  }

  public async updatePassword(id: string, password: string): Promise<void> {
    await this.update(id, { password: password });
  }

  public async saveUser(user: User): Promise<void> {
    await this.save(user);
  }

  public async findUserByEmail(userEmail: string): Promise<User> {
    return await this.findOne({
      where: { userEmail: userEmail },
    });
  }

  public async findUserById(id: string): Promise<User> {
    return await this.findOne({
      where: { Id: id },
    });
  }
}
