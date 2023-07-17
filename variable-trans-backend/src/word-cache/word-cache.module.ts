import { Module } from '@nestjs/common';
import { WordCacheService } from './word-cache.service';
import { wordCacheMapService } from './implementation/word-cache-map.service';

@Module({
  providers: [
    {
      provide: 'WordCached',
      useClass: wordCacheMapService,
    },
  ],
  exports: ['WordCached'],
})
export class WordCacheModule {}
