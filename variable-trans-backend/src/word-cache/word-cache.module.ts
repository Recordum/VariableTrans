import { Module } from '@nestjs/common';
import { WordCacheMapService } from './implementation/word-cache-map.service';

@Module({
  providers: [
    {
      provide: 'WordCached',
      useClass: WordCacheMapService,
    },
  ],
  exports: ['WordCached'],
})
export class WordCacheModule {}
