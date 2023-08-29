import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RedisSessionService } from '../src/user/service/session/implementation/redis-sessoin.service';
import {
  SetSessionDto,
  SetSessionDtoBuilder,
} from '../src/user/dto/set-session.dto';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';

describe('Translation (e2e)', () => {
  let app: INestApplication;
  let redisSessionService: RedisSessionService;
  let moduleFixture: TestingModule;
  let testSessionData: SetSessionDto;
  let dataSource: DataSource;
  const SESSION_ID = 'test-session-id';
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // Global ValidationPipe 추가
    await app.init();

    redisSessionService =
      moduleFixture.get<RedisSessionService>('SessionService');

    testSessionData = new SetSessionDtoBuilder()
      .setSessionId(SESSION_ID)
      .setUserId('test-user-id')
      .setRequestLimit(10)
      .setGrade('normal')
      .build();
  });

  describe('/translation (GET)', () => {
    it('한국어 입력시 네이밍 컨벤션으로 변환하여 변수명 반환', async () => {
      await redisSessionService.setSessionData(testSessionData);
      return request(app.getHttpServer())
        .get('/translation?korean=' + encodeURIComponent('변수명을추천하다'))
        .set('sessionid', SESSION_ID)
        .expect(200)
        .expect({
          snakeCase: 'recommend_variable_names',
          camelCase: 'recommendVariableNames',
          pascalCase: 'RecommendVariableNames',
        });
    });

    it('로그인 하지 않고 번역 요청시 401 반환', async () => {
      return request(app.getHttpServer())
        .get('/translation?korean=' + encodeURIComponent('변수명을추천하다'))
        .expect(401);
    });
  });

  afterAll(async () => {
    await redisSessionService.deleteSessionData(SESSION_ID);
    const wordRedisClient = moduleFixture.get<Redis>('WORD_REDIS');
    const sessionRedisClient = moduleFixture.get<Redis>('SESSION_REDIS');
    await wordRedisClient.quit();
    await sessionRedisClient.quit();
    await app.close();
  });
});
