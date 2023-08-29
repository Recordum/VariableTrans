import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('User (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let PASSWORD: string;
  let USER_EMAIL: string;
  let SESSION_ID: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // Global ValidationPipe 추가
    await app.init();

    PASSWORD = 'testPassword';
    USER_EMAIL = 'mingyu@example.com';
    SESSION_ID = 'SessionId';
  });

  describe('/user/register (POST)', () => {
    it('userEmail이 email 형식이 아닐떄 400 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({ userEmail: 'mingyu', password: PASSWORD })
        .expect(400);
    });

    it('userEmail이 empty 일때 400 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({ userEmail: '', password: PASSWORD })
        .expect(400);
    });

    it('password가 empty 일때 400 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({ userEmail: USER_EMAIL, password: '' })
        .expect(400);
    });

    it('userEmail과 password를 전송시 201 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({ userEmail: USER_EMAIL, password: PASSWORD })
        .expect(201);
    });

    it('이미 가입된 userEmail 일 경우 400 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({ userEmail: USER_EMAIL, password: PASSWORD })
        .expect(400);
    });
  });

  describe('/user/login (POST)', () => {
    it('틀린 userEmail 전송시 400 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/login')
        .send({ userEmail: 'wonrg@email.com', password: PASSWORD })
        .expect(401);
    });

    it('틀린 password 전송시 400 반환', async () => {
      return request(app.getHttpServer())
        .post('/user/login')
        .send({ userEmail: USER_EMAIL, password: 'wrongPassword' })
        .expect(401);
    });

    it('올바른 userEmail 및 password 전송시 sessionId 반환', () => {
      return request(app.getHttpServer())
        .post('/user/login')
        .send({ userEmail: USER_EMAIL, password: PASSWORD })
        .expect(201)
        .expect((res) => {
          if (!res.body.sessionId) {
            throw new Error('Missing sessionId test failed');
          }
        });
    });
  });

  afterAll(async () => {
    const wordRedisClient = moduleFixture.get<Redis>('WORD_REDIS');
    const sessionRedisClient = moduleFixture.get<Redis>('SESSION_REDIS');
    await wordRedisClient.quit();
    await sessionRedisClient.quit();
    await app.close();
  });
});
