import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import * as crypto from 'crypto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ResponseSessionIdDto } from '../dto/response-session.dto';
import { AuthGuard } from '../service/auth/auth-guard';
import { UserService } from '../service/user.service';

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
