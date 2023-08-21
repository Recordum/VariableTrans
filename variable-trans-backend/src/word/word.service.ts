import { Word } from './entitiy/word.entity';

export interface WordService {
  getWord(korean: string): Promise<Word>;
  saveWord(korean: string, word: Word): Promise<void>;
  createWord(korean: string, variable: string): Word;
}
