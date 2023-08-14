export interface WordService {
  findWord(korean: string): Promise<string>;
  saveWord(korean: string, word: string): Promise<void>;
}
