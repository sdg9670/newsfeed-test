import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { MySubscribtionService } from './mySubscribtion.service';
import { DatabaseService } from '../common/database/database.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Subscribtion } from '@prisma/client';

describe('MySubscribtionService', () => {
  let mySubscribtionService: MySubscribtionService;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MySubscribtionService,
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    mySubscribtionService = app.get<MySubscribtionService>(
      MySubscribtionService,
    );
    databaseService = app.get<DeepMockProxy<DatabaseService>>(DatabaseService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('getMySubscribtions', () => {
    it('Should return subscribtions and total page', async () => {
      const userId = '1';
      const page = 1;
      const limit = 10;
      const subscribtions: Subscribtion[] = [
        {
          id: '1',
          userId,
          schoolId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest
        .spyOn(databaseService.subscribtion, 'findMany')
        .mockResolvedValue(subscribtions);
      jest.spyOn(databaseService.subscribtion, 'count').mockResolvedValue(1);

      const result = await mySubscribtionService.getMySubscribtions({
        userId,
        page,
        limit,
      });

      expect(result).toEqual({
        subscribtions,
        totalPage: 1,
      });
    });
  });

  describe('subscribe', () => {
    it('Should return subscribtion', async () => {
      const userId = '1';
      const schoolId = '1';
      const subscribtion: Subscribtion = {
        id: '1',
        userId,
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      jest
        .spyOn(databaseService.subscribtion, 'findFirst')
        .mockResolvedValue(null);
      jest
        .spyOn(databaseService.subscribtion, 'create')
        .mockResolvedValue(subscribtion);

      const result = await mySubscribtionService.subscribe({
        userId,
        schoolId,
      });

      expect(result).toEqual(subscribtion);
    });

    it('Should throw an error if the subscribtion is already exist', async () => {
      jest.spyOn(databaseService.subscribtion, 'findFirst').mockResolvedValue({
        id: '1',
        userId: '1',
        schoolId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      expect(
        mySubscribtionService.subscribe({
          userId: '1',
          schoolId: '1',
        }),
      ).rejects.toThrow('You already subscribed this school');
    });
  });

  describe('unsubscribe', () => {
    it('Should return subscribtion', async () => {
      const userId = '1';
      const schoolId = '1';
      const subscribtion: Subscribtion = {
        id: '1',
        userId,
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      jest
        .spyOn(databaseService.subscribtion, 'findFirst')
        .mockResolvedValue(subscribtion);
      jest
        .spyOn(databaseService.subscribtion, 'update')
        .mockResolvedValue(subscribtion);
      const deletedAt = new Date();
      jest.useFakeTimers().setSystemTime(deletedAt);
      const result = await mySubscribtionService.unsubscribe({
        userId,
        schoolId,
      });

      expect(result).toEqual({ ...subscribtion, deletedAt });
    });

    it('Should throw an error if the subscribtion is not exist', async () => {
      jest
        .spyOn(databaseService.subscribtion, 'findFirst')
        .mockResolvedValue(null);

      expect(
        mySubscribtionService.unsubscribe({
          userId: '1',
          schoolId: '1',
        }),
      ).rejects.toThrow('You did not subscribe this school');
    });
  });
});
