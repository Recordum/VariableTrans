import { Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';
import Redis from 'ioredis';
import { plainToClass } from 'class-transformer';
import { Word } from 'src/batch/entity/word.entity';

@Injectable()
export class RedisCacheWordService implements CacheWordService {
  private client: Redis;

  constructor() {
    this.client = new Redis({ host: 'localhost', port: 6380 });
  }

  public async setWord(korean: string, word: Word): Promise<void> {
    await this.client.set(korean, JSON.stringify(word), 'EX', 86400);
  }

  public async deleteWord(korean: string): Promise<void> {
    await this.client.del(korean);
  }

  public async getWord(korean: string): Promise<Word> {
    const result = await this.client.get(korean);
    return result ? plainToClass(Word, JSON.parse(result)) : null;
  }

  public async isCachedWord(korean: string): Promise<boolean> {
    const result = await this.client.get(korean);
    return result !== null;
  }

  public async trackWord(word: Word): Promise<void> {
    await this.client.sadd('trackedWords', JSON.stringify(word));
    console.log(`tracked 
    
    Word: ${word}`);
  }

  public async getTrackedWords(): Promise<Word[]> {
    const pipeline = this.client.pipeline();
    // pipeline에 명령 추가
    pipeline.smembers('trackedWords');
    pipeline.del('trackedWords');
    const results = await pipeline.exec();

    const trackedKoreans = results[0][1] as string[];

    return trackedKoreans.map((word) => plainToClass(Word, JSON.parse(word)));
  }
}
