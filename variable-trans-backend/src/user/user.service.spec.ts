import { SessionService } from './session/session.service';
import { UserRepository } from './repository/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

class MockUserRepository implements UserRepository {
  public users: User[] = [];

  async saveUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async findUserById(id: string): Promise<User> {
    return this.users.find((user) => user.Id === id);
  }

  async findUserByEmail(userEmail: string): Promise<User> {
    return this.users.find((user) => user.userEmail === userEmail);
  }
}
describe('UserService', () => {
  let service: UserService;
  let userRepository: MockUserRepository;
  let sessionService: jest.Mocked<Partial<SessionService>>;
  let USER_EMAIL: string;
  let PASSWORD: string;

  beforeEach(async () => {
    sessionService = {
      setSessionData: jest.fn(),
      deleteSessionData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useClass: MockUserRepository },
        { provide: 'SessionService', useValue: sessionService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockUserRepository>('UserRepository');
    PASSWORD = 'testPassword';
    USER_EMAIL = 'mingyu@example.com';
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
      const user = new User();
      user.userEmail = USER_EMAIL;
      userRepository.saveUser(user);

      const registerUserDto = new RegisterUserDto(USER_EMAIL, PASSWORD);

      await expect(
        service.registerUser(registerUserDto),
      ).rejects.toThrowError();
    });
  });

  describe('validateUserCredentials', () => {
    it('주어진 Email로 가입된 회원이 존재하지 않을 경우 UnauthorizedException 발생', async () => {
      const user = new User();
      user.userEmail = USER_EMAIL;
      user.password = await bcrypt.hash(PASSWORD, 10);
      userRepository.saveUser(user);

      const loginUserDto = new LoginUserDto(
        'unknown@example.com',
        'wrongPassword',
      );

      await expect(
        service.validateUserCredentials(loginUserDto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('주어진 Email로 가입된 회원이 존재하나 비밀번호가 틀린경우 UnauthorizedException 발생', async () => {
      const user = new User();
      user.userEmail = USER_EMAIL;
      user.password = await bcrypt.hash(PASSWORD, 10);
      userRepository.saveUser(user);

      const loginUserDto = new LoginUserDto(USER_EMAIL, 'wrongPassword');

      await expect(
        service.validateUserCredentials(loginUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('Email 비밀번호가 전부 맞은 경우 Reposiotry에 저장된 user의 id 변환', async () => {
      const user = new User();
      user.userEmail = USER_EMAIL;
      user.password = await bcrypt.hash(PASSWORD, 10);
      userRepository.saveUser(user);
      const loginUserDto = new LoginUserDto(USER_EMAIL, PASSWORD);

      const result = await service.validateUserCredentials(loginUserDto);

      const foundUser = await userRepository.findUserByEmail(USER_EMAIL);
      expect(result.getUserId()).toBe(foundUser.Id);
    });
  });
});
