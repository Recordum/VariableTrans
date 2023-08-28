import { Inject, Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';
import { Word } from '../../../entity/word.entity';
import Redis from 'ioredis';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RedisCacheWordService implements CacheWordService {
  constructor(
    @Inject('WORD_REDIS')
    private readonly redis: Redis,
  ) {}

  public async setWord(korean: string, word: Word): Promise<void> {
    await this.redis.set(korean, JSON.stringify(word), 'EX', 86400);
  }

  public async deleteWord(korean: string): Promise<void> {
    await this.redis.del(korean);
  }

  public async getWord(korean: string): Promise<Word> {
    const result = await this.redis.get(korean);
    return result ? plainToClass(Word, JSON.parse(result)) : null;
  }

  public async isCachedWord(korean: string): Promise<boolean> {
    const result = await this.redis.get(korean);
    return result !== null;
  }

  public async trackWord(word: Word): Promise<void> {
    await this.redis.sadd('trackedWords', JSON.stringify(word));
  }

  public async getTrackedWords(): Promise<Word[]> {
    const trackedKoreans: string[] = await this.redis.smembers('trackedWords');
    const trackedWords: Word[] = await Promise.all(
      trackedKoreans.map((word) => plainToClass(Word, JSON.parse(word))),
    );
    await this.redis.del('trackedWords');
    return trackedWords;
  }
}
