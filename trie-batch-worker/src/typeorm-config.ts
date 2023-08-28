import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Word } from './batch/entity/word.entity';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  entities: [Word],
  synchronize: true,
};
