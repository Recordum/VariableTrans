import { LoginUserDto } from '../dto/login-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController, GenerateSessionId } from './user.controller';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AuthGuard } from '../service/auth/auth-guard';
import { MockUserRepository } from '../service/user.service.spec';
import { User } from '../entity/user.entity';
import { MockSessionService } from '../service/auth/auth-guard.spec';
import { SetSessionDtoBuilder } from '../dto/set-session.dto';
import { UserService } from '../service/user.service';
import { ResponseSessionIdDto } from '../dto/response-session.dto';
/**
 * UserController는 단순히 UserService를 호출하는 하기 때문에
 * 실제 UserService를 주입하여 테스트 코드 작성.
 * UserService가 의존하는
 * UserRepository와 SessionService를 Mock Class 주입.
 */
describe('UserController', () => {
  let userController: UserController;
  let authGaurd: Partial<jest.Mocked<AuthGuard>>;
  let userRepository: MockUserRepository;
  let sessionService: MockSessionService;
  let generateSessionId: jest.Mocked<GenerateSessionId>;
  let PASSWORD: string;
  let USER_EMAIL: string;
  let SESSION_ID: string;

  beforeEach(async () => {
    authGaurd = {
      canActivate: jest.fn().mockReturnValue(true),
    };
    generateSessionId = {
      generate: jest.fn().mockReturnValue(SESSION_ID),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: GenerateSessionId, useValue: generateSessionId },
        { provide: AuthGuard, useValue: authGaurd },
        { provide: 'SessionService', useClass: MockSessionService },
        { provide: 'UserRepository', useClass: MockUserRepository },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userRepository = module.get<MockUserRepository>('UserRepository');
    sessionService = module.get<MockSessionService>('SessionService');
    PASSWORD = 'testPassword';
    USER_EMAIL = 'mingyu@example.com';
    SESSION_ID = 'SessionId';
  });

  describe('register', () => {
    it('회원가입 성공시 Repoisotry에 User 정보 저장', async () => {
      const registerUserDto: RegisterUserDto = new RegisterUserDto(
        USER_EMAIL,
        PASSWORD,
      );

      await userController.register(registerUserDto);

      expect(userRepository.findUserByEmail(USER_EMAIL)).not.toBeUndefined();
    });

    it('중복된 Email로 가입시 Error 발생', async () => {
      userRepository.saveUser(new User(USER_EMAIL, PASSWORD));
      const registerUserDto: RegisterUserDto = new RegisterUserDto(
        USER_EMAIL,
        PASSWORD,
      );

      await expect(
        userController.register(registerUserDto),
      ).rejects.toThrowError();
    });
  });

  describe('login', () => {
    it('잘못된 Email 로 로그인시 Error 발생', async () => {
      const loginUserDto: LoginUserDto = new LoginUserDto(
        'wrongEmail@email.com',
        PASSWORD,
      );
      const user: User = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      await userRepository.saveUser(user);

      await expect(userController.login(loginUserDto)).rejects.toThrowError();
    });

    it('잘못된 비밀번호 로 로그인시 Error 발생', async () => {
      const loginUserDto: LoginUserDto = new LoginUserDto(
        USER_EMAIL,
        'wrongPassword',
      );
      const user: User = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      await userRepository.saveUser(user);

      await expect(userController.login(loginUserDto)).rejects.toThrowError();
    });

    it('로그인 성공시 세션 ID Dto 반환', async () => {
      const loginUserDto: LoginUserDto = new LoginUserDto(USER_EMAIL, PASSWORD);
      const user: User = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      await userRepository.saveUser(user);

      const result = await userController.login(loginUserDto);

      expect(result).toEqual(new ResponseSessionIdDto(SESSION_ID));
    });
  });
  describe('logout', () => {
    it('logout시 session 저장소에서 sessionData 삭제', async () => {
      const user: User = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      await userRepository.saveUser(user);
      const sessionData = new SetSessionDtoBuilder()
        .setGrade(user.getGrade())
        .setRequestLimit(user.getRequestLimit())
        .setSessionId(SESSION_ID)
        .setUserId(user.getId())
        .build();
      await sessionService.setSessionData(sessionData);

      const mockSession = {
        sessionId: SESSION_ID,
      };

      await userController.logout(mockSession as any);

      expect(await sessionService.getSessionData(SESSION_ID)).toBeUndefined();
    });
  });
});
