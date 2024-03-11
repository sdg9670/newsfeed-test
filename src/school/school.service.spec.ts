import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { DatabaseService } from '../common/database/database.service';
import { SchoolService } from './school.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Admin, School } from '@prisma/client';

describe('SchoolService', () => {
  let schoolService: SchoolService;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();
    schoolService = app.get<SchoolService>(SchoolService);
    databaseService = app.get<DeepMockProxy<DatabaseService>>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('createSchool', () => {
    it('Should return a school', async () => {
      const data = {
        name: 'name',
        location: 'location',
        adminId: '1',
      };
      const admin: Admin = {
        id: data.adminId,
        email: 'email',
        name: 'name',
        schoolId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const school: School = {
        id: '1',
        name: data.name,
        location: data.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(admin);
      jest.spyOn(databaseService.school, 'findUnique').mockResolvedValue(null);
      jest.spyOn(databaseService.school, 'create').mockResolvedValue(school);
      jest.spyOn(databaseService.admin, 'update').mockResolvedValue(admin);
      const result = await schoolService.createSchool(data);

      expect(result).toEqual(school);
    });

    it('Should throw an error if the admin does not exist', async () => {
      const data = {
        name: 'name',
        location: 'location',
        adminId: '1',
      };
      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(null);

      await expect(schoolService.createSchool(data)).rejects.toThrowError(
        'The admin does not exist',
      );
    });

    it('Should throw an error if the admin already has a school', async () => {
      const data = {
        name: 'name',
        location: 'location',
        adminId: '1',
      };
      const admin: Admin = {
        id: data.adminId,
        email: 'email',
        name: 'name',
        schoolId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(admin);

      await expect(schoolService.createSchool(data)).rejects.toThrowError(
        'The admin already has a school',
      );
    });

    it('Should throw an error if the school already exists', async () => {
      const data = {
        name: 'name',
        location: 'location',
        adminId: '1',
      };
      const admin: Admin = {
        id: data.adminId,
        email: 'email',
        name: 'name',
        schoolId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const school: School = {
        id: '1',
        name: data.name,
        location: data.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(admin);
      jest
        .spyOn(databaseService.school, 'findUnique')
        .mockResolvedValue(school);

      await expect(schoolService.createSchool(data)).rejects.toThrowError(
        'The school already exists',
      );
    });
  });
});
