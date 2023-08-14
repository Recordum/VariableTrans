import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WordCacheModule } from 'src/word-cache/word-cache.module';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { PaPagoTranslator } from './request-translation/implementation/papago-translator';

@Module({
  imports: [HttpModule, WordCacheModule],
  providers: [
    {
      provide: 'Translator',
      useClass: PaPagoTranslator,
    },
    TranslationService,
  ],
  controllers: [TranslationController],
})
export class TranslationModule {}
