import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisSessionService } from './session/implementation/redis-sessoin.service';
import { MySqlUserRepository } from './repository/implementation/mysql.user.repoistory';

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
