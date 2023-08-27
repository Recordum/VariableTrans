import { Module } from '@nestjs/common';
import { WordServiceImpl } from './service/word.service.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entity/word.entity';
import { MysqlWordRepository } from './repository/implemnetation/mysql-word.repository';
import { RedisCacheWordService } from './service/cache-word/implementation/redis-cache-word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [
    {
      provide: 'CacheWordService',
      useClass: RedisCacheWordService,
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
  exports: ['WordService'],
})
export class WordModule {}
