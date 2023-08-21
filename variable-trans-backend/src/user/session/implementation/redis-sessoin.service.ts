import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SetSessionDto, SetSessionDtoBuilder } from '../dto/set-session.dto';
import { SessionService } from '../session.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisSessionService implements SessionService {
  constructor(@Inject(CACHE_MANAGER) private redis: Cache) {}

  public async getSessionData(sessionId: string): Promise<SetSessionDto> {
    const sessionData = await this.redis.get(sessionId);
    if (!sessionData) {
      throw new UnauthorizedException('존재하지 않는 세션입니다');
    }
    return new SetSessionDtoBuilder()
      .setSessionId(sessionId)
      .setUserId(sessionData['userId'])
      .setGrade(sessionData['grade'])
      .setRequestLimit(sessionData['requestLimit'])
      .build();
  }
  public async setSessionData(setSessionDto: SetSessionDto): Promise<void> {
    const sessionId = setSessionDto.getSessionId();
    const userId = setSessionDto.getUserId();
    const grade = setSessionDto.getGrade();
    const requestLimit = setSessionDto.getRequestLimit();
    await this.redis.set(sessionId, {
      grade: grade,
      userId: userId,
      requestLimit: requestLimit,
    });
  }
  public async deleteSessionData(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }
}
