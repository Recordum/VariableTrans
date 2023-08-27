import { Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';
import { Word } from 'src/word/entity/word.entity';
import Redis from 'ioredis';
import { plainToClass } from 'class-transformer';

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
    const trackedKoreans: string[] = await this.client.smembers('trackedWords');
    const trackedWords: Word[] = await Promise.all(
      trackedKoreans.map((word) => plainToClass(Word, JSON.parse(word))),
    );
    await this.client.del('trackedWords');
    return trackedWords;
  }
}
