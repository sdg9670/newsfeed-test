import { ROLE } from '../models/role.model';
import { Roles } from './roles.decorator';

describe('RolesDecorator', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Roles', () => {
    it('Should return decorator function', async () => {
      const mockRoles = [ROLE.ADMIN, ROLE.USER];
      const rolesDecorator = Roles(mockRoles);

      expect(rolesDecorator).toBeDefined();
    });
  });
});
