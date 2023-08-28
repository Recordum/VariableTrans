import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WordModule } from '../word/word.module';
import { RedisSessionService } from '../user/service/session/implementation/redis-sessoin.service';
import { TranslationController } from './controller/translation.controller';
import { TranslationService } from './service/translation.service';
import { PaPagoTranslator } from './service/translator/implementation/papago-translator';
import { RedisModule } from '../redis.module';

@Module({
  imports: [HttpModule, WordModule, RedisModule],
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
