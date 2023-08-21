import { Word } from './entity/word.entity';

export interface WordService {
  getWord(korean: string): Promise<Word>;
  saveWord(korean: string, word: Word): Promise<void>;
  createWord(korean: string, variable: string): Word;
}
