import { getParamDecoratorFactory } from '../../../test/common/utils';
import { AuthEntity } from '../models/auth.model';
import { Auth } from './auth.decorator';

describe('AuthDecorator', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Auth', () => {
    it('Should return admin and user cookies', async () => {
      const mockAdmin = { id: '1', email: 'test@test.dev' };
      const mockUser = { id: '2', email: 'test2@test.dev' };
      const mockCtx = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({
          cookies: {
            'admin-auth': JSON.stringify(mockAdmin),
            'user-auth': JSON.stringify(mockUser),
          },
        }),
      };

      const factory = getParamDecoratorFactory<Partial<AuthEntity>>(Auth);
      const result = factory(undefined, mockCtx);

      expect(result).toEqual({ admin: mockAdmin, user: mockUser });
    });
  });

  it('Should return undefined if cookies are not defined', async () => {
    const mockCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        cookies: {},
      }),
    };

    const factory = getParamDecoratorFactory<Partial<AuthEntity>>(Auth);
    const result = factory(undefined, mockCtx);

    expect(result).toEqual({ admin: undefined, user: undefined });
  });
});
