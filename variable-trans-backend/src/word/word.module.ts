import { Module } from '@nestjs/common';
import { CacheMapWordService } from './cache-word/implementation/cache-map-word.service';
import { WordServiceImpl } from './word.service.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entitiy/word.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
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
