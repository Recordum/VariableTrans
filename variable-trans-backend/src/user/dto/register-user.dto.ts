import { IsNotEmpty } from 'class-validator';
import { User } from '../entity/user.entity';

export class RegisterUserDto {
  @IsNotEmpty()
  private userEmail: string;

  @IsNotEmpty()
  private password: string;

  public toEntity(): User {
    const user: User = new User();
    user.passowrd = this.password;
    user.userEmail = this.userEmail;
    return user;
  }
}
