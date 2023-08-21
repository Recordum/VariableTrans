import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SetSessionDto } from './session/dto/set-session.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ResponseSessionIdDto } from './session/dto/response-session.dto';
import { AuthGuard } from './auth/auth-guard';
export class GenerateSessionId {
  public generate(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly generateSessionId: GenerateSessionId,
  ) {}

  @Post('register')
  public async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<void> {
    await this.userService.registerUser(registerUserDto);
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseSessionIdDto> {
    const sessionId = this.generateSessionId.generate();
    return await this.userService.login(loginUserDto, sessionId);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  public async logout(@Req() request): Promise<void> {
    const sessionId = request.headers['sessionid'];
    await this.userService.logout(sessionId);
  }
}
