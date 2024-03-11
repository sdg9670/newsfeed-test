import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './rolesGuard.guard';
import { ROLE } from '../models/role.model';
import { mock } from 'jest-mock-extended';
import { Reflector } from '@nestjs/core';

describe('RolesGurardGuard', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('RolesGuard', () => {
    it('Should return true if cookies are defined', async () => {
      const mockAdmin = { id: '1', email: 'test1@test.dev' };
      const mockUser = { id: '2', email: 'test2@test.dev' };
      const mockCtx = mock<ExecutionContext>();
      mockCtx.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: {
            'admin-auth': JSON.stringify(mockAdmin),
            'user-auth': JSON.stringify(mockUser),
          },
        }),
        getNext: jest.fn(),
        getResponse: jest.fn(),
      });
      const rolesReflector = new Reflector();
      rolesReflector.get = jest.fn().mockReturnValue([ROLE.ADMIN]);
      let rolesGuard = new RolesGuard(rolesReflector);
      const adminResult = rolesGuard.canActivate(mockCtx);
      rolesReflector.get = jest.fn().mockReturnValue([ROLE.USER]);
      rolesGuard = new RolesGuard(rolesReflector);
      const userResult = rolesGuard.canActivate(mockCtx);

      expect(adminResult).toBeTruthy();
      expect(userResult).toBeTruthy();
    });
  });

  it('Should return false if cookies are not defined', async () => {
    const mockCtx = mock<ExecutionContext>();
    mockCtx.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        cookies: {},
      }),
      getNext: jest.fn(),
      getResponse: jest.fn(),
    });
    const rolesReflector = new Reflector();
    rolesReflector.get = jest.fn().mockReturnValue([ROLE.ADMIN]);
    let rolesGuard = new RolesGuard(rolesReflector);
    const adminResult = rolesGuard.canActivate(mockCtx);
    rolesReflector.get = jest.fn().mockReturnValue([ROLE.USER]);
    rolesGuard = new RolesGuard(rolesReflector);
    const userResult = rolesGuard.canActivate(mockCtx);

    expect(adminResult).toBeFalsy();
    expect(userResult).toBeFalsy();
  });

  it('Should return true if roles are empty', async () => {
    const mockAdmin = { id: '1', email: 'test1@test.dev' };
    const mockUser = { id: '2', email: 'test2@test.dev' };
    const mockCtx = mock<ExecutionContext>();
    mockCtx.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        cookies: {
          'admin-auth': JSON.stringify(mockAdmin),
          'user-auth': JSON.stringify(mockUser),
        },
      }),
      getNext: jest.fn(),
      getResponse: jest.fn(),
    });
    const rolesReflector = new Reflector();
    rolesReflector.get = jest.fn().mockReturnValue([]);
    const rolesGuard = new RolesGuard(rolesReflector);
    const result = rolesGuard.canActivate(mockCtx);

    expect(result).toBeTruthy();
  });
});
