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
  constructor(private readonly userService: UserService) {}

  @Post('register')
  public async register(@Body() registerUserDto: RegisterUserDto) {
    await this.userService.registerUser(registerUserDto);
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseSessionIdDto> {
    const sessionId = crypto.randomBytes(32).toString('hex');
    return await this.userService.login(loginUserDto, sessionId);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  public async logout(@Req() sessionData: SetSessionDto) {
    const sessionId = sessionData.getSessionId();
    await this.userService.logout(sessionId);
  }
}
