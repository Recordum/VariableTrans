import { Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';

@Injectable()
export class CacheMapWordService implements CacheWordService {
  private wordMap: Map<string, string> = new Map();

  public getWord(korean: string): string {
    if (!this.isCachedWord(korean)) {
      throw new Error('not cached word');
    }
    return this.wordMap.get(korean);
  }

  public isCachedWord(korean: string): boolean {
    return this.wordMap.has(korean);
  }

  public setWord(korean: string, word: string): void {
    this.wordMap.set(korean, word);
  }

  public deleteWord(koreanWord: string): void {
    if (!this.isCachedWord(koreanWord)) {
      throw new Error('can not delete word');
    }
    this.wordMap.delete(koreanWord);
  }
}
