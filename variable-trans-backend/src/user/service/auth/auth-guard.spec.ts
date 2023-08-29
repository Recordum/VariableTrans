import { Test, TestingModule } from '@nestjs/testing';
import { SetSessionDtoBuilder } from '../../dto/set-session.dto';
import { AuthGuard } from './auth-guard';
import { MemorySessionService } from '../session/implementation/memory-session.service';

describe('AuthGuard: canActivate()', () => {
  let service: AuthGuard;
  let sessionService: MemorySessionService;
  let LIMIT: number;
  let GRADE: string;
  let USER_ID: string;
  let SESSION_ID: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: 'SessionService', useClass: MemorySessionService },
      ],
    }).compile();

    service = module.get<AuthGuard>(AuthGuard);
    sessionService = module.get<MemorySessionService>('SessionService');
    LIMIT = 20;
    GRADE = 'normal';
    USER_ID = 'userId';
    SESSION_ID = 'testId';
  });

  it('SessionId를 Header 에 보내지 않는 요청에 대해 Error 반환', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
      }),
    };

    await expect(service.canActivate(context as any)).rejects.toThrowError();
  });

  it('유효하지 않운 SessionId 에 대해 error 반환', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { sessionid: 'wrongSessionid' } }),
      }),
    };
    const setSessionDto = new SetSessionDtoBuilder()
      .setGrade(GRADE)
      .setSessionId(SESSION_ID)
      .setRequestLimit(0)
      .setUserId(USER_ID)
      .build();
    sessionService.setSessionData(setSessionDto);

    await expect(service.canActivate(context as any)).rejects.toThrowError();
  });

  it('요청회수 초과시 error 반환', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { sessionid: SESSION_ID } }),
      }),
    };
    const setSessionDto = new SetSessionDtoBuilder()
      .setGrade(GRADE)
      .setSessionId(SESSION_ID)
      .setRequestLimit(LIMIT)
      .setUserId(USER_ID)
      .build();
    sessionService.setSessionData(setSessionDto);

    await expect(service.canActivate(context as any)).rejects.toThrowError();
  });

  it('유효한 sessionId 및 요청횟수가 요청제한수 미만시 true 반환', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { sessionid: SESSION_ID } }),
      }),
    };
    const setSessionDto = new SetSessionDtoBuilder()
      .setGrade(GRADE)
      .setSessionId(SESSION_ID)
      .setRequestLimit(0)
      .setUserId(USER_ID)
      .build();
    sessionService.setSessionData(setSessionDto);

    const result = await service.canActivate(context as any);

    expect(result).toBe(true);
  });
});
