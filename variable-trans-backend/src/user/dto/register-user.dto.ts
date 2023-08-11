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
    const user: User = new User();
    user.password = this.password;
    user.userEmail = this.userEmail;
    return user;
  }

  public async encodePassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public getUserEmail(): string {
    return this.userEmail;
  }
}
