import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'WORD_REDIS',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('WORD_REDIS_HOST'),
          port: Number(configService.get('WORD_REDIS_PORT')),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'SESSION_REDIS',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('SESSION_REDIS_HOST'),
          port: Number(configService.get('SESSION_REDIS_PORT')),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['WORD_REDIS', 'SESSION_REDIS'],
})
export class RedisModule {}
