import { ValidatedUserDto } from './dto/validated-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entity/user.entity';
import {
  SetSessionDto,
  SetSessionDtoBuilder,
} from './session/dto/set-session.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import * as crypto from 'crypto';
import { ResponseSessionIdDto } from './session/dto/response-session.dto';
import { AuthGuard } from './auth/auth-guard';

@Controller('user')
export class UserController {
  constructor(private readonly userSerivce: UserService) {}

  @Post('register')
  public async register(@Body() registerUserDto: RegisterUserDto) {
    await this.userSerivce.registerUser(registerUserDto);
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseSessionIdDto> {
    const validateUserDto: ValidatedUserDto =
      await this.userSerivce.validateUserCredentials(loginUserDto);

    const sessionId = crypto.randomBytes(32).toString('hex');
    const setSessionDto: SetSessionDto = new SetSessionDtoBuilder()
      .setSessionId(sessionId)
      .setUserId(validateUserDto.getUserId())
      .setGrade(validateUserDto.getGrade())
      .setRequestLimit(validateUserDto.getRequestLimit())
      .build();

    return new ResponseSessionIdDto(
      await this.userSerivce.setSession(setSessionDto),
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  public async logout(@Req() sessionData: SetSessionDto) {
    await this.userSerivce.updateRequestLimitAndSession(
      sessionData.getSessionId(),
    );
  }
}
