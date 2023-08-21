import { CacheWordService } from '../cache-word/cache-word.service';
import { WordRepository } from '../../repository/word.repository';
import { SessionService } from '../../../user/session/session.service';
import { Inject, Injectable } from '@nestjs/common';
import { Word } from '../../entity/word.entity';

@Injectable()
export class BatchService {
  constructor(
    @Inject('CacheWordService')
    private readonly CacheWordService: CacheWordService,
    @Inject('WordRepository') private readonly wordRepository: WordRepository,
  ) {}
  public async trackNewWord(word: Word) {
    await this.CacheWordService.trackWord(word);
  }

  public async migrateNewWordsToRepository() {
    const words: word[] = await this.CacheWordService.getTrackedWords();
    await this.wordRepository.saveWord();
  }
}
