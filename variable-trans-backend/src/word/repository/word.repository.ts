import { Word } from '../entitiy/word.entity';

export interface WordRepository {
  findWordByKorean(korean: string): Promise<Word>;
  saveWord(word: Word): Promise<void>;
}
