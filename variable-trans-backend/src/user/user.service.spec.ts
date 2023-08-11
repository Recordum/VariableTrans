import { SessionService } from './session/session.service';
import { UserRepository } from './repository/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('TranslationService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Partial<UserRepository>>;
  let sessionService: jest.Mocked<Partial<SessionService>>;

  beforeEach(async () => {
    userRepository = {
      save: jest.fn(),
      findUserByEmail: jest.fn(),
    };

    sessionService = {
      setSessionData: jest.fn(),
      deleteSessionData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: userRepository },
        { provide: 'SessionService', useValue: sessionService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });
  describe('registerUser', () => {
    it('회원가입 테스트', async () => {
      const dto = new RegisterUserDto('mingyu@example.com', 'testPassword');
      await dto.encodePassword();
      const user = dto.toEntity();

      await service.registerUser(dto);

      expect(userRepository.save).toHaveBeenCalled();
    });
  });
  describe('validateUserCredentials', () => {
    it('주어진 Email로 가입된 회원이 존재하지 않을 경우', async () => {
      const storedUser = new User();
      storedUser.userEmail = 'known@example.com';
      storedUser.password = await bcrypt.hash('correctPassword', 10);
      userRepository.findUserByEmail.mockResolvedValue(storedUser);
      const loginUserDto = new LoginUserDto(
        'unknown@example.com',
        'testPassword',
      );

      await expect(
        service.validateUserCredentials(loginUserDto),
      ).rejects.toThrowError(UnauthorizedException);
    });
    it('주어진 Email로 가입된 회원이 존재하나 비밀번호가 틀린경우', async () => {
      const storedUser = new User();
      storedUser.userEmail = 'known@example.com';
      storedUser.password = await bcrypt.hash('correctPassword', 10);
      userRepository.findUserByEmail.mockResolvedValue(storedUser);
      const loginUserDto = new LoginUserDto(
        'known@example.com',
        'wrongPassword',
      );

      await expect(
        service.validateUserCredentials(loginUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('Email 비밀번호가 전부 맞은 경우 로그인 성공', async () => {
      const storedUser = new User();
      storedUser.userEmail = 'known@example.com';
      storedUser.password = await bcrypt.hash('correctPassword', 10);
      userRepository.findUserByEmail.mockResolvedValue(storedUser);
      const loginUserDto = new LoginUserDto(
        'known@example.com',
        'correctPassword',
      );

      const result = await service.validateUserCredentials(loginUserDto);

      expect(result.getUserId()).toBe(storedUser.Id);
    });
  });
});
