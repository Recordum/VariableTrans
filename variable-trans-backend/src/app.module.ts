import { Global, Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { WordModule } from './word/word.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entity/user.entity';
import { Word } from './word/entity/word.entity';
import { Redis } from 'ioredis';

console.log(process.env.NODE_ENV);
console.log(`.${process.env.NODE_ENV}.env`);
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
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModule> => ({
        type: configService.get('DB_TYPE'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        port: Number(configService.get('DB_PORT')),
        host: configService.get('DB_HOST'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Word],
        synchronize: true,
      }),
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
