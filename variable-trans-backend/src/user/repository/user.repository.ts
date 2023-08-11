import { User } from '../entity/user.entity';

export interface UserRepository {
  save(user: User): Promise<void>;
  findUserByEmail(userEmail: string): Promise<User>;
  findUserById(id: string): Promise<User>;
}
