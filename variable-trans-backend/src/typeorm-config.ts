import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { Word } from './word/entity/word.entity';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: process.env.DB_TYPE as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  entities: [User, Word],
  synchronize: true,
});
