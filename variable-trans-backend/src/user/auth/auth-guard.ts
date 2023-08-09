import {
  SetSessionDto,
  SetSessionDtoBuilder,
} from '../session/dto/set-session.dto';
import { SessionService } from '../session/session.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('Session') private readonly session: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['x-session-id'];

    if (!sessionId) {
      return false;
    }

    const sessionData: SetSessionDto = await this.session.getSessionData(
      sessionId,
    );

    if (!sessionData) {
      return false;
    }

    const requestLimit: number = this.IncrementedRequestLimit(sessionData);

    const updateSessionData: SetSessionDto = this.updateSession(
      requestLimit,
      sessionData,
    );

    if (this.exceedLimit(updateSessionData)) {
      return false;
    }

    request.user = updateSessionData;
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

    this.session.setSessionData(updateSessionData);
    return updateSessionData;
  }

  private exceedLimit(updateSessionData: SetSessionDto): boolean {
    return (
      updateSessionData.getRequestLimit() > 20 &&
      updateSessionData.getGrade() === 'normal'
    );
  }
}
