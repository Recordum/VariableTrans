export interface WordCacheService {
  setWordCached(koreanWord: string, variable: string): void;
  deleteWordCached(koreanWord: string): void;
  getCachedVariable(koreanWord: string): string;
  isWordCached(koreanWord: string): boolean;
}
