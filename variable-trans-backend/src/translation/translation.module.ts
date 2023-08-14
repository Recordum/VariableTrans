import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WordCacheModule } from 'src/word-cache/word-cache.module';
import { RequestTranslationImpl } from './request-translation/implementation/request-translation.impl';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';

@Module({
  imports: [HttpModule, WordCacheModule],
  providers: [
    {
      provide: 'RequestTranslation',
      useClass: RequestTranslationImpl,
    },
    TranslationService,
  ],
  controllers: [TranslationController],
})
export class TranslationModule {}
