import { Injectable } from '@nestjs/common';
import { CacheWordService } from '../cache-word.service';

@Injectable()
export class CacheMapWordService implements CacheWordService {
  private variableMap: Map<string, string> = new Map();

  public getCachedVariable(koreanWord: string): string {
    if (!this.isWordCached(koreanWord)) {
      throw new Error('not cached word');
    }
    return this.variableMap.get(koreanWord);
  }

  public isWordCached(koreanWord: string): boolean {
    return this.variableMap.has(koreanWord);
  }

  public setWordCached(koreanWord: string, variable: string): void {
    this.variableMap.set(koreanWord, variable);
  }

  public deleteWordCached(koreanWord: string): void {
    if (!this.isWordCached(koreanWord)) {
      throw new Error('can not delete word');
    }
    this.variableMap.delete(koreanWord);
  }
}
