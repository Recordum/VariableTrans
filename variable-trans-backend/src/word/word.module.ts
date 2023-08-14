import { Module } from '@nestjs/common';
import { CacheMapWordService } from './cache-word/implementation/cache-map-word.service';
import { WordServiceImpl } from './word.service.impl';

@Module({
  providers: [
    {
      provide: 'CacheWordService',
      useClass: CacheMapWordService,
    },
    {
      provide: 'WordService',
      useClass: WordServiceImpl,
    },
  ],
  exports: ['WordService'],
})
export class WordModule {}
