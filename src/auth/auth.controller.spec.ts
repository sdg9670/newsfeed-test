import { MockProxy, mock } from 'jest-mock-extended';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: MockProxy<AuthService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mock<AuthService>(),
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<MockProxy<AuthService>>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('loginAdmin', () => {
    it('Should return an admin id and admin-auth cooki if the email is found', async () => {
      const email = 'test1@test.dev';
      const adminId = '1';
      authService.loginAdmin.mockResolvedValue(adminId);
      const mockResponse = mock<Response>();
      const result = await authController.loginAdmin({ email }, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'admin-auth',
        JSON.stringify({ email, id: adminId }, null, 0),
        {
          httpOnly: true,
          expires: expect.any(Date),
        },
      );
      expect(result).toBe(adminId);
    });
  });

  describe('logoutAdmin', () => {
    it('Should clear the admin-auth cookie', () => {
      const mockResponse = mock<Response>();
      authController.logoutAdmin(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('admin-auth');
    });
  });

  describe('loginUser', () => {
    it('Should return a user and user-auth cookie id if the email is found', async () => {
      const email = 'test1@test.dev';
      const userId = '1';
      authService.loginUser.mockResolvedValue(userId);
      const mockResponse = mock<Response>();
      const result = await authController.loginUser({ email }, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'user-auth',
        JSON.stringify({ email, id: userId }, null, 0),
        {
          httpOnly: true,
          expires: expect.any(Date),
        },
      );
      expect(result).toBe(userId);
    });
  });

  describe('logoutUser', () => {
    it('Should clear the user-auth cookie', () => {
      const mockResponse = mock<Response>();
      authController.logoutUser(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('user-auth');
    });
  });
});
