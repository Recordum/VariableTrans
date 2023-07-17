import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { WordCacheModule } from './word-cache/word-cache.module';

@Module({
  imports: [TranslationModule, WordCacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
