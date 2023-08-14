import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { PaPagoTranslator } from './translator/implementation/papago-translator';
import { WordModule } from 'src/word/word.module';

@Module({
  imports: [HttpModule, WordModule],
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
