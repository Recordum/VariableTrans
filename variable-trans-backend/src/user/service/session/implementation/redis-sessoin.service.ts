import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SetSessionDto } from '../../../dto/set-session.dto';
import { SessionService } from '../session.service';
import Redis from 'ioredis';
import { plainToClass } from 'class-transformer';
import { SessionDataDto } from 'src/user/dto/session-data.dto';

@Injectable()
export class RedisSessionService implements SessionService {
  constructor(@Inject('SESSION_REDIS') private redis: Redis) {}

  public async getSessionData(sessionId: string): Promise<SessionDataDto> {
    const sessionData = await this.redis.get(sessionId);
    if (!sessionData) {
      throw new UnauthorizedException('존재하지 않는 세션입니다');
    }

    return plainToClass(SessionDataDto, JSON.parse(sessionData));
  }

  public async setSessionData(setSessionDto: SetSessionDto): Promise<void> {
    const sessionId = setSessionDto.getSessionId();
    const sessionDataDto: SessionDataDto =
      SessionDataDto.fromSetSessionData(setSessionDto);
    await this.redis.set(
      sessionId,
      JSON.stringify(sessionDataDto),
      'EX',
      86400,
    );
  }
  public async deleteSessionData(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }
}
