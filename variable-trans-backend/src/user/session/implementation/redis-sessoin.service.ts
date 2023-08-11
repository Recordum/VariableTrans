import { Inject, Injectable } from '@nestjs/common';
import { SetSessionDto } from '../dto/set-session.dto';
import { SessionService } from '../session.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisSessionService implements SessionService {
  constructor(@Inject(CACHE_MANAGER) private redis: Cache) {}

  public async getSessionData(sessionId: string): Promise<SetSessionDto> {
    return await this.redis.get(sessionId);
  }
  public async setSessionData(setSessionDto: SetSessionDto): Promise<void> {
    await this.redis.set(setSessionDto.getSessionId(), setSessionDto, 86400);
  }
  public async deleteSessionData(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }
}
