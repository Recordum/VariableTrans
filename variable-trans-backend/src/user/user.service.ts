import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';
import { SessionService } from './session/session.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    await registerUserDto.encodePassword();
    const user: User = registerUserDto.toEntity();
    this.userRepository.save(user);
  }

  public async isEmailAlreadyRegistered(userEmail: string): Promise<boolean> {
    const existingUser: User = await this.userRepository.findUserByEmail(
      userEmail,
    );
    if (existingUser) {
      return true;
    }
    return false;
  }

  public async login(loginUserDto: LoginUserDto): Promise<string> {
    const user: User = await this.userRepository.findUserByEmail(
      loginUserDto.getUserEmail(),
    );
    if (
      !user ||
      !this.validatePassword(loginUserDto.getPassword(), user.passowrd)
    ) {
      throw new UnauthorizedException('잘못된 Email 혹은 비밀번호 입니다.');
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    this.sessionService.setSessionData(sessionId, user);
    return sessionId;
  }

  private validatePassword(loginPassword: string, password: string): boolean {
    return loginPassword === password;
  }
}
