import { IsNotEmpty } from 'class-validator';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

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

  public async encodePassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
