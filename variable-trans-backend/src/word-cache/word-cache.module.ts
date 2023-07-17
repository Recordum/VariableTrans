import { Module } from '@nestjs/common';
import { WordCacheMapService } from './implementation/word-cache-map.service';

@Module({
  providers: [
    {
      provide: 'WordCacheService',
      useClass: WordCacheMapService,
    },
  ],
  exports: ['WordCacheService'],
})
export class WordCacheModule {}
