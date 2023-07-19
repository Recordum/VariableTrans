import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { WordCacheModule } from './word-cache/word-cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './typeorm-config';

@Module({
  imports: [
    TranslationModule,
    WordCacheModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
