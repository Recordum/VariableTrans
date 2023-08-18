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

  public async getVariable(korean: string): Promise<string> | undefined {
    if (await this.cacheWordService.isCachedWord(korean)) {
      return this.cacheWordService.getVariable(korean);
    }
    const word: Word = await this.wordRepository.findWordByKorean(korean);
    if (word) {
      await this.cacheWordService.setWord(korean, word.getVariable());
    }
    return word?.getVariable();
  }

  public async saveVariable(korean: string, variable: string): Promise<void> {
    const word: Word = this.createWord(korean, variable);

    await Promise.all([
      this.cacheWordService.setWord(korean, variable),
      this.wordRepository.saveWord(word),
    ]);
  }

  private createWord(korean: string, variable: string): Word {
    return new Word(korean, variable);
  }
}
