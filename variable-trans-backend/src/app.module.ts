import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { WordModule } from './word/word.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './typeorm-config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TranslationModule,
    WordModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
