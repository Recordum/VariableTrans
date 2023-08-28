import { Module } from '@nestjs/common';
import { WordServiceImpl } from './service/word.service.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entity/word.entity';
import { MysqlWordRepository } from './repository/implemnetation/mysql-word.repository';
import { RedisCacheWordService } from './service/cache-word/implementation/redis-cache-word.service';
import { RedisModule } from '../redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), RedisModule],
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
