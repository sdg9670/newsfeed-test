import { MockProxy, mock } from 'jest-mock-extended';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthEntity } from '../common/models/auth.model';

describe('SchoolController', () => {
  let schoolController: SchoolController;
  let schoolService: MockProxy<SchoolService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [
        {
          provide: SchoolService,
          useValue: mock<SchoolService>(),
        },
      ],
    }).compile();

    schoolController = app.get<SchoolController>(SchoolController);
    schoolService = app.get<MockProxy<SchoolService>>(SchoolService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('createSchool', () => {
    it('Should return a school', async () => {
      const auth = mock<AuthEntity>();
      const body = {
        name: 'name',
        location: 'location',
      };
      const school = {
        id: '1',
        name: body.name,
        location: body.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(schoolService, 'createSchool').mockResolvedValue(school);
      const result = await schoolController.createSchool(auth, body);

      expect(result).toEqual(school);
    });
  });
});
