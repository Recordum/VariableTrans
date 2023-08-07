import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  private userEmail: string;
  @IsNotEmpty()
  private password: string;

  constructor(userEmail: string, passowrd: string) {
    this.password = passowrd;
    this.userEmail = userEmail;
  }
  public getUserEmail(): string {
    return this.userEmail;
  }

  public getPassword(): string {
    return this.password;
  }
}
