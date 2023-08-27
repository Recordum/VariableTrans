import { Inject, Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { WordRepository } from '../repository/word.repository';
import { Word } from '../entity/word.entity';
import { CacheWordService } from './cache-word/cache-word.service';
@Injectable()
export class BatchService {
  constructor(
    @Inject('CacheWordService')
    private readonly CacheWordService: CacheWordService,
    @Inject('WordRepository') private readonly wordRepository: WordRepository,
  ) {}

  // @Cron('0 4 * * *') // 매일 새벽 4시에 batch 실행
  @Interval(20000)
  public async migrateNewWordsToRepository(): Promise<void> {
    const words: Word[] = await this.CacheWordService.getTrackedWords();
    if (words.length === 0) {
      console.log('EMPTY');
      return;
    }
    const start = Date.now();
    await this.wordRepository.batchWords(words);
    const end = Date.now();
    const executionTime = end - start;
    console.log(`BATCH 처리 시간 : ${executionTime}`);
  }
}
