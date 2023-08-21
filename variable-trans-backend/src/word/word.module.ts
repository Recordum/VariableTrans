import { Module } from '@nestjs/common';
import { CacheMapWordService } from './cache-word/implementation/cache-map-word.service';
import { WordServiceImpl } from './word.service.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entity/word.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { MysqlWordRepository } from './repository/implemnetation/mysql-word.repository';

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
    {
      provide: 'WordRepository',
      useClass: MysqlWordRepository,
    },
  ],
  exports: ['WordService', Word],
})
export class WordModule {}
