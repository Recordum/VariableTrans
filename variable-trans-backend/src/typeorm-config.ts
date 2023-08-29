import { User } from './user/entity/user.entity';
import { Word } from './word/entity/word.entity';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = async (configService: ConfigService) => {
  return {
    type: configService.get('DB_TYPE'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    port: Number(configService.get('DB_PORT')),
    host: configService.get('DB_HOST'),
    database: configService.get('DB_DATABASE'),
    entities: [User, Word],
    synchronize: false,
  };
};
