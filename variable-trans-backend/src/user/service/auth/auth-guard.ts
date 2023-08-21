import {
  SetSessionDto,
  SetSessionDtoBuilder,
} from '../../dto/set-session.dto';
import { SessionService } from '../session/session.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('SessionService') private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['sessionid'];
    if (!sessionId) {
      throw new UnauthorizedException('로그인이 필요한 서비스 입니다');
    }

    const sessionData: SetSessionDto = await this.sessionService.getSessionData(
      sessionId,
    );

    const requestLimit: number = this.IncrementedRequestLimit(sessionData);

    const updateSessionData: SetSessionDto = this.updateSession(
      requestLimit,
      sessionData,
    );

    if (this.exceedLimit(updateSessionData)) {
      throw new UnauthorizedException('요청 횟수 초과');
    }

    request.sessionData = updateSessionData;
    return true;
  }

  private IncrementedRequestLimit(sessionData: SetSessionDto): number {
    return sessionData.getRequestLimit() + 1;
  }

  private updateSession(
    requestLimit: number,
    sessionData: SetSessionDto,
  ): SetSessionDto {
    const updateSessionData: SetSessionDto = new SetSessionDtoBuilder()
      .setSessionId(sessionData.getSessionId())
      .setGrade(sessionData.getGrade())
      .setUserId(sessionData.getUserId())
      .setRequestLimit(requestLimit)
      .build();

    this.sessionService.setSessionData(updateSessionData);
    return updateSessionData;
  }

  private exceedLimit(updateSessionData: SetSessionDto): boolean {
    return (
      updateSessionData.getRequestLimit() > 20 &&
      updateSessionData.getGrade() === 'normal'
    );
  }
}
