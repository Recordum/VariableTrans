import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { PaPagoTranslator } from './translator/implementation/papago-translator';
import { WordModule } from 'src/word/word.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisSessionService } from 'src/user/session/implementation/redis-sessoin.service';

@Module({
  imports: [
    HttpModule,
    WordModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [
    {
      provide: 'SessionService',
      useClass: RedisSessionService,
    },
    {
      provide: 'Translator',
      useClass: PaPagoTranslator,
    },
    TranslationService,
  ],
  controllers: [TranslationController],
})
export class TranslationModule {}
