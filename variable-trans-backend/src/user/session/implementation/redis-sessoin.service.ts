import { Inject, Injectable } from '@nestjs/common';
import { SetSessionDto, SetSessionDtoBuilder } from '../dto/set-session.dto';
import { SessionService } from '../session.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RedisSessionService implements SessionService {
  constructor(@Inject(CACHE_MANAGER) private redis: Cache) {}

  public async getSessionData(sessionId: string): Promise<SetSessionDto> {
    const sessionData = await this.redis.get(sessionId);
    if (!sessionData) {
      throw new Error('세션 저장소에 세션이 존재하지 않습니다.');
    }
    return new SetSessionDtoBuilder()
      .setSessionId(sessionData['sessionId'])
      .setUserId(sessionData['userId'])
      .setGrade(sessionData['grade'])
      .setRequestLimit(sessionData['requestLimit'])
      .build();
  }
  public async setSessionData(setSessionDto: SetSessionDto): Promise<void> {
    await this.redis.set(setSessionDto.getSessionId(), setSessionDto, 86400);
  }
  public async deleteSessionData(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }
}
