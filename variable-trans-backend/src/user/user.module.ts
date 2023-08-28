import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { MySqlUserRepository } from './repository/implementation/mysql.user.repoistory';
import { RedisSessionService } from './service/session/implementation/redis-sessoin.service';
import { UserService } from './service/user.service';
import {
  GenerateSessionId,
  UserController,
} from './controller/user.controller';
import { RedisModule } from '../redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
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
