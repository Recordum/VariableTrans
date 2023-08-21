import { Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';
import { Word } from 'src/word/entity/word.entity';

@Injectable()
export class CacheMapWordService implements CacheWordService {
  private wordMap: Map<string, Word> = new Map();

  public async getWord(korean: string): Promise<Word> {
    if (!(await this.isCachedWord(korean))) {
      throw new Error('not cached word');
    }
    return this.wordMap.get(korean);
  }

  public async isCachedWord(korean: string): Promise<boolean> {
    return this.wordMap.has(korean);
  }

  public async setWord(korean: string, word: Word): Promise<void> {
    this.wordMap.set(korean, word);
  }

  public async deleteWord(korean: string): Promise<void> {
    if (!(await this.isCachedWord(korean))) {
      throw new Error('can not delete word');
    }
    this.wordMap.delete(korean);
  }
}
