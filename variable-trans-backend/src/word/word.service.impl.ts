import { CacheWordService } from './cache-word/cache-word.service';
import { Inject } from '@nestjs/common';
import { WordService } from './word.service';
import { WordRepository } from './word.repository';

export class WordServiceImpl implements WordService {
  constructor(
    @Inject('CacheWordService')
    private readonly cacheWordService: CacheWordService,
    @Inject('WordRepository') private readonly wordRepository: WordRepository,
  ) {}

  public async findWord(korean: string): Promise<string> | undefined {
    if (await this.cacheWordService.isCachedWord(korean)) {
      return this.cacheWordService.getWord(korean);
    }
    return this.wordRepository.findWordByKorean(korean);
  }

  public async saveWord(korean: string, word: string): Promise<void> {
    await this.wordRepository.saveWord(korean, word);
  }
}
