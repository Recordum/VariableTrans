import { User } from '../../entity/user.entity';
import { UserRepository } from '../user.repository';

export class MemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async updateRequestLimit(id: string, requestLimit: number) {
    const user = await this.findUserById(id);
    user.requestLimit = requestLimit;
    this.saveUser(user);
  }

  async updatePassword(id: string, password: string) {
    const user = await this.findUserById(id);
    user.password = password;
    this.saveUser(user);
  }

  async saveUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async findUserById(id: string): Promise<User> {
    return this.users.find((user) => user.Id === id);
  }

  async findUserByEmail(userEmail: string): Promise<User> {
    return this.users.find((user) => user.userEmail === userEmail);
  }
}
