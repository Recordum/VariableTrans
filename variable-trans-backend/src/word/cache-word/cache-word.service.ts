export interface CacheWordService {
  setWord(korean: string, word: string): Promise<void>;
  deleteWord(korean: string): Promise<void>;
  getVariable(korean: string): Promise<string>;
  isCachedWord(korean: string): Promise<boolean>;
}
