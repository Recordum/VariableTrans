import { Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';

@Injectable()
export class CacheMapWordService implements CacheWordService {
  private wordMap: Map<string, string> = new Map();

  public async getWord(korean: string): Promise<string> {
    if (!(await this.isCachedWord(korean))) {
      throw new Error('not cached word');
    }
    return this.wordMap.get(korean);
  }

  public async isCachedWord(korean: string): Promise<boolean> {
    return this.wordMap.has(korean);
  }

  public async setWord(korean: string, word: string): Promise<void> {
    this.wordMap.set(korean, word);
  }

  public async deleteWord(korean: string): Promise<void> {
    if (!(await this.isCachedWord(korean))) {
      throw new Error('can not delete word');
    }
    this.wordMap.delete(korean);
  }
}
