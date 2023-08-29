import { Global, Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { WordModule } from './word/word.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entity/user.entity';
import { Word } from './word/entity/word.entity';
import { getTypeOrmConfig } from './typeorm-config';

console.log('현재 실행 환경 : ' + process.env.NODE_ENV);
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    TranslationModule,
    WordModule,
    UserModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
