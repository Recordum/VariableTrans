import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { WordCacheModule } from './word-cache/word-cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './typeorm-config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TranslationModule,
    WordCacheModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
