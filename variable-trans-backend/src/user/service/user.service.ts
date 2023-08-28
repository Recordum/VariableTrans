import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session/session.service';

import { UserRepository } from '../repository/user.repository';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../entity/user.entity';
import { ResponseSessionIdDto } from '../dto/response-session.dto';
import { SetSessionDto, SetSessionDtoBuilder } from '../dto/set-session.dto';
import { SessionDataDto } from '../dto/session-data.dto';

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
    const user: User = registerUserDto.toEntity();
    await user.encodePassword();
    await this.userRepository.saveUser(user);
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
    if (!user || !(await user.validatePasword(loginUserDto.getPassword()))) {
      throw new UnauthorizedException('잘못된 Email 혹은 비밀번호 입니다.');
    }
    return user;
  }

  private createSessionData(user: User, sessionId: string): SetSessionDto {
    const setSessionDto: SetSessionDto = new SetSessionDtoBuilder()
      .setSessionId(sessionId)
      .setUserId(user.getId())
      .setGrade(user.getGrade())
      .setRequestLimit(user.getRequestLimit())
      .build();
    return setSessionDto;
  }

  private async setSession(setSessionDto: SetSessionDto) {
    await this.sessionService.setSessionData(setSessionDto);
  }

  public async logout(sessionId: string): Promise<void> {
    const sessionDataDto: SessionDataDto =
      await this.sessionService.getSessionData(sessionId);

    await Promise.all([
      this.userRepository.updateRequestLimit(
        sessionDataDto.getUserId(),
        sessionDataDto.getRequestLimit(),
      ),
      this.sessionService.deleteSessionData(sessionId),
    ]);
  }
}
