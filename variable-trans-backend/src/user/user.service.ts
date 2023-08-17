import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SessionService } from './session/session.service';
import * as bcrypt from 'bcrypt';
import {
  SetSessionDto,
  SetSessionDtoBuilder,
} from './session/dto/set-session.dto';
import { ResponseSessionIdDto } from './session/dto/response-session.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('SessionService') private readonly sessionService: SessionService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    if (await this.isEmailAlreadyRegistered(registerUserDto.getUserEmail())) {
      throw new HttpException(
        '이미 존재하는 이메일입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    await registerUserDto.encodePassword();
    const user: User = registerUserDto.toEntity();
    this.userRepository.saveUser(user);
  }

  private async isEmailAlreadyRegistered(userEmail: string): Promise<boolean> {
    const existingUser: User = await this.userRepository.findUserByEmail(
      userEmail,
    );
    if (existingUser) {
      return true;
    }
    return false;
  }

  public async login(
    loginUserDto: LoginUserDto,
    sessionId: string,
  ): Promise<ResponseSessionIdDto> {
    const user: User = await this.validateUserCredentials(loginUserDto);
    const setSessionDto: SetSessionDto = this.createSessionData(
      user,
      sessionId,
    );
    await this.setSession(setSessionDto);
    return new ResponseSessionIdDto(sessionId);
  }

  private async validateUserCredentials(
    loginUserDto: LoginUserDto,
  ): Promise<User> {
    const user: User = await this.userRepository.findUserByEmail(
      loginUserDto.getUserEmail(),
    );
    if (
      !user ||
      !(await this.validatePassword(loginUserDto.getPassword(), user.password))
    ) {
      throw new UnauthorizedException('잘못된 Email 혹은 비밀번호 입니다.');
    }
    return user;
  }

  private validatePassword(
    loginPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(loginPassword, password);
  }

  private createSessionData(user: User, sessionId: string): SetSessionDto {
    const setSessionDto: SetSessionDto = new SetSessionDtoBuilder()
      .setSessionId(sessionId)
      .setUserId(user.Id)
      .setGrade(user.grade)
      .setRequestLimit(user.requestLimit)
      .build();
    return setSessionDto;
  }

  private async setSession(setSessionDto: SetSessionDto): Promise<string> {
    await this.sessionService.setSessionData(setSessionDto);
    return setSessionDto.getSessionId();
  }

  public async logout(sessionId: string): Promise<void> {
    const sessionDto: SetSessionDto = await this.sessionService.getSessionData(
      sessionId,
    );
    await Promise.all([
      this.userRepository.updateRequestLimit(
        sessionDto.getUserId(),
        sessionDto.getRequestLimit(),
      ),
      this.sessionService.deleteSessionData(sessionId),
    ]);
  }
}
