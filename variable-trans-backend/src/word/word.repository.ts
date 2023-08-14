export interface WordRepository {
  findWordByKorean(korean: string): Promise<string>;
  saveWord(korean: string, word: string): Promise<void>;
}
