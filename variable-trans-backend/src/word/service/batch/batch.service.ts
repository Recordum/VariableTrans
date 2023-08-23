import { CacheWordService } from '../cache-word/cache-word.service';
import { WordRepository } from '../../repository/word.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Word } from '../../entity/word.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BatchService {
  constructor(
    @Inject('CacheWordService')
    private readonly CacheWordService: CacheWordService,
    @Inject('WordRepository') private readonly wordRepository: WordRepository,
  ) {}

  @Cron('0 4 * * *') // 매일 새벽 4시에 batch 실행
  public async migrateNewWordsToRepository() {
    const words: Word[] = await this.CacheWordService.getTrackedWords();
    await Promise.all(words.map((word) => this.wordRepository.saveWord(word)));
  }

  public async trackNewWord(word: Word) {
    await this.CacheWordService.trackWord(word);
  }
}
