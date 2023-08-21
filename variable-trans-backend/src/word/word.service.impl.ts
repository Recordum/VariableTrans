import { CacheWordService } from './cache-word/cache-word.service';
import { Inject } from '@nestjs/common';
import { WordService } from './word.service';
import { WordRepository } from './repository/word.repository';
import { Word } from './entitiy/word.entity';

export class WordServiceImpl implements WordService {
  constructor(
    @Inject('CacheWordService')
    private readonly cacheWordService: CacheWordService,
    @Inject('WordRepository') private readonly wordRepository: WordRepository,
  ) {}

  public async getWord(korean: string): Promise<Word> | undefined {
    if (await this.cacheWordService.isCachedWord(korean)) {
      console.log('wordService : CACHE HIT!');
      return this.cacheWordService.getWord(korean);
    }
    const word: Word = await this.wordRepository.findWordByKorean(korean);
    if (word) {
      await this.cacheWordService.setWord(korean, word);
    }
    return word;
  }

  public async saveWord(korean: string, word: Word): Promise<void> {
    await Promise.all([
      this.cacheWordService.setWord(korean, word),
      this.wordRepository.saveWord(word),
    ]);
  }

  public createWord(korean: string, variable: string): Word {
    return new Word(korean, variable);
  }
}
