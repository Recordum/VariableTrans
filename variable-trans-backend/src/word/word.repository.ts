interface WordRepository {
  findWordByKorean(korean: string): Promise<string>;
  saveWord(word: string, korean: string): Promise<void>;
}
