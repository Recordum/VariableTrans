export interface CacheWordService {
  setWord(korean: string, word: string): void;
  deleteWord(korean: string): void;
  getWord(korean: string): string;
  isCachedWord(korean: string): boolean;
}
