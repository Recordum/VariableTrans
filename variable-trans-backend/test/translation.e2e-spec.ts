import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RedisSessionService } from '../src/user/service/session/implementation/redis-sessoin.service';
import { SetSessionDtoBuilder } from '../src/user/dto/set-session.dto';

describe('TranslationController (e2e)', () => {
  let app: INestApplication;
  let redisSessionService: RedisSessionService;
  const SESSION_ID = 'test-session-id';
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // Global ValidationPipe 추가
    await app.init();

    redisSessionService =
      moduleFixture.get<RedisSessionService>('SessionService');

    const testSessionData = new SetSessionDtoBuilder()
      .setSessionId(SESSION_ID)
      .setUserId('test-user-id')
      .setRequestLimit(10)
      .setGrade('normal')
      .build();
    await redisSessionService.setSessionData(testSessionData);
  });

  describe('/translation (GET)', () => {
    it('should return translated variable name', () => {
      // 이 예제는 쿼리 매개 변수 korean이 "예제"일 때 응답으로 어떤 값이 반환되는지를 테스트합니다.
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
  });

  afterAll(async () => {
    await redisSessionService.deleteSessionData(SESSION_ID);
    await app.close();
  });
});
