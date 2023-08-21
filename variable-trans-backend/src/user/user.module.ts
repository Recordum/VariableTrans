import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { MySqlUserRepository } from './repository/implementation/mysql.user.repoistory';
import { RedisSessionService } from './service/session/implementation/redis-sessoin.service';
import { UserService } from './service/user.service';
import {
  GenerateSessionId,
  UserController,
} from './controller/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [
    UserService,
    GenerateSessionId,
    {
      provide: 'SessionService',
      useClass: RedisSessionService,
    },
    {
      provide: 'UserRepository',
      useClass: MySqlUserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
