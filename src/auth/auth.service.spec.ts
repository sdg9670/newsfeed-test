import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from '../common/database/database.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Admin, User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    databaseService = app.get<DeepMockProxy<DatabaseService>>(DatabaseService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('loginAdmin', () => {
    it('Should return admin id if the email is found', async () => {
      const email = 'test1@test.dev';
      const admin: Admin = {
        id: '1',
        email,
        name: 'test1',
        schoolId: 'test1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(admin);
      const result = await authService.loginAdmin(email);

      expect(result).toBe(admin.id);
    });

    it('Should throw an error if the email is not found', async () => {
      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(null);

      expect(authService.loginAdmin('test1@test.dev')).rejects.toThrow(
        'The email not found',
      );
    });
  });

  describe('loginUser', () => {
    it('Should return user id if the email is found', async () => {
      const email = 'test1@test.dev';
      const user: User = {
        id: '1',
        email,
        name: 'test1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(user);
      const result = await authService.loginUser(email);

      expect(result).toBe(user.id);
    });

    it('Should throw an error if the email is not found', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      expect(authService.loginUser('test1@test.dev')).rejects.toThrow(
        'The email not found',
      );
    });
  });
});
