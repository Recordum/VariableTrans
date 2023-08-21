import { Word } from '../../entity/word.entity';

export interface CacheWordService {
  setWord(korean: string, word: Word): Promise<void>;
  deleteWord(korean: string): Promise<void>;
  getWord(korean: string): Promise<Word>;
  isCachedWord(korean: string): Promise<boolean>;
}
