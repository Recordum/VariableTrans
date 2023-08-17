import { IsNotEmpty } from 'class-validator';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

export class RegisterUserDto {
  @IsNotEmpty()
  private userEmail: string;

  @IsNotEmpty()
  private password: string;

  constructor(userEmail: string, password: string) {
    this.userEmail = userEmail;
    this.password = password;
  }
  public toEntity(): User {
    const user: User = new User(this.userEmail, this.password);
    return user;
  }

  public getUserEmail(): string {
    return this.userEmail;
  }
}
