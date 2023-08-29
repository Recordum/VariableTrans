import { UserRepository } from '../repository/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../entity/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SetSessionDtoBuilder } from '../dto/set-session.dto';
import { MemoryUserRepository } from '../repository/implementation/memory-user.repository';
import { MemorySessionService } from './session/implementation/memory-session.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let sessionService: MemorySessionService;
  let USER_EMAIL: string;
  let PASSWORD: string;
  let SESSION_ID: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useClass: MemoryUserRepository },
        { provide: 'SessionService', useClass: MemorySessionService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MemoryUserRepository>('UserRepository');
    sessionService = module.get<MemorySessionService>('SessionService');
    PASSWORD = 'testPassword';
    USER_EMAIL = 'mingyu@example.com';
    SESSION_ID = 'SessionId';
  });
  describe('registerUser', () => {
    it('회원가입시 Repository에 저장됨', async () => {
      const reigsterUserDto = new RegisterUserDto(USER_EMAIL, PASSWORD);

      await service.registerUser(reigsterUserDto);

      const savedUser: User = await userRepository.findUserByEmail(USER_EMAIL);
      const isPasswordMatch = await bcrypt.compare(
        PASSWORD,
        savedUser.password,
      );
      expect(savedUser.userEmail).toBe(USER_EMAIL);
      expect(isPasswordMatch).toBeTruthy();
    });

    it('중복 Email 회원가입시 Error 발생', async () => {
      const user = new User(USER_EMAIL, PASSWORD);
      userRepository.saveUser(user);

      const registerUserDto = new RegisterUserDto(USER_EMAIL, PASSWORD);

      await expect(
        service.registerUser(registerUserDto),
      ).rejects.toThrowError();
    });
  });

  describe('login', () => {
    it('주어진 Email로 가입된 회원이 존재하지 않을 경우 UnauthorizedException 발생', async () => {
      const user = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      userRepository.saveUser(user);

      const loginUserDto = new LoginUserDto(
        'unknown@example.com',
        'wrongPassword',
      );

      await expect(
        service.login(loginUserDto, SESSION_ID),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('주어진 Email로 가입된 회원이 존재하나 비밀번호가 틀린경우 UnauthorizedException 발생', async () => {
      const user = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      userRepository.saveUser(user);

      const loginUserDto = new LoginUserDto(USER_EMAIL, 'wrongPassword');

      await expect(service.login(loginUserDto, SESSION_ID)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Email 비밀번호가 전부 맞은 경우 session을 저장 하고 sessionId를 반환', async () => {
      const user = new User(USER_EMAIL, PASSWORD);
      await user.encodePassword();
      userRepository.saveUser(user);
      const loginUserDto = new LoginUserDto(USER_EMAIL, PASSWORD);

      const result = await service.login(loginUserDto, SESSION_ID);

      expect(result).toEqual({ sessionId: SESSION_ID });
    });
  });
  describe('logout ', () => {
    it('세션저장소에서 세션을 지우고 RequestLimit을 DB에 update', async () => {
      const user = new User(USER_EMAIL, PASSWORD);
      user.encodePassword();
      await userRepository.saveUser(user);

      const setSessionDto = new SetSessionDtoBuilder()
        .setGrade(user.getGrade())
        .setRequestLimit(100)
        .setSessionId(SESSION_ID)
        .setUserId(user.getId())
        .build();
      await sessionService.setSessionData(setSessionDto);

      await service.logout(SESSION_ID);

      const foundUser: User = await userRepository.findUserByEmail(USER_EMAIL);

      expect(foundUser.requestLimit).toBe(100);
      expect(await sessionService.getSessionData(SESSION_ID)).toBeUndefined();
    });
  });
});
