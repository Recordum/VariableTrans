import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  private userEmail: string;
  @IsNotEmpty()
  private password: string;

  public getUserEmail(): string {
    return this.userEmail;
  }

  public getPassword(): string {
    return this.password;
  }
}
