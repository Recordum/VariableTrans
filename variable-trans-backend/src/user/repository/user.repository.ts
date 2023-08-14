import { User } from '../entity/user.entity';

export interface UserRepository {
  saveUser(user: User): Promise<void>;
  findUserByEmail(userEmail: string): Promise<User>;
  findUserById(id: string): Promise<User>;
  updateRequestLimit(id: string, requestLimit: number): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
}
