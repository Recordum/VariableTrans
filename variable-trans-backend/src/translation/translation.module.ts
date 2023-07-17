import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WordCacheModule } from 'src/word-cache/word-cache.module';
import { RequestTranslationImpl } from './request-translation/implementation/request-translation.impl';
import { TranslationController } from './translation.controller';
import { TranslationServiceImpl } from './implementation/translation.service.impl';

@Module({
  imports: [HttpModule, WordCacheModule],
  providers: [
    {
      provide: 'RequestTranslation',
      useClass: RequestTranslationImpl,
    },
    {
      provide: 'TranslationService',
      useClass: TranslationServiceImpl,
    },
  ],
  controllers: [TranslationController],
})
export class TranslationModule {}
