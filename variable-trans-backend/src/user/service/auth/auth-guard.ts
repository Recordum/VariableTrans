import { AuthErrorMessage } from '../../../constants/execption-message';
import { DAILY_LIMIT, UserGrade } from '../../../constants/user-constants';
import { SessionDataDto } from '../../dto/session-data.dto';
import { SetSessionDto, SetSessionDtoBuilder } from '../../dto/set-session.dto';
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
    const sessionId: string = request.headers['sessionid'];
    if (!sessionId) {
      throw new UnauthorizedException(AuthErrorMessage.NEED_LOGIN);
    }

    const sessionData: SessionDataDto =
      await this.sessionService.getSessionData(sessionId);

    if (!sessionData) {
      throw new UnauthorizedException(AuthErrorMessage.EXPIRES_SESSION);
    }

    const requestLimit: number = this.IncrementedRequestLimit(sessionData);

    const updateSessionData: SetSessionDto = this.updateSession(
      requestLimit,
      sessionId,
      sessionData,
    );

    if (this.exceedLimit(updateSessionData)) {
      throw new UnauthorizedException(AuthErrorMessage.REQUEST_LIMIT_EXCEEDED);
    }

    request.sessionData = updateSessionData;
    return true;
  }

  private IncrementedRequestLimit(sessionData: SessionDataDto): number {
    return sessionData.getRequestLimit() + 1;
  }

  private updateSession(
    requestLimit: number,
    sessionId: string,
    sessionData: SessionDataDto,
  ): SetSessionDto {
    const updateSessionData: SetSessionDto = new SetSessionDtoBuilder()
      .setSessionId(sessionId)
      .setGrade(sessionData.getGrade())
      .setUserId(sessionData.getUserId())
      .setRequestLimit(requestLimit)
      .build();

    this.sessionService.setSessionData(updateSessionData);
    return updateSessionData;
  }

  private exceedLimit(updateSessionData: SetSessionDto): boolean {
    return (
      updateSessionData.getRequestLimit() > DAILY_LIMIT &&
      updateSessionData.getGrade() === UserGrade.NORMAL
    );
  }
}
