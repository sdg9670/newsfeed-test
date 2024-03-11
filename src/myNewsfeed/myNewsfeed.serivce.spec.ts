import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { MyNewsfeedService } from './myNewsfeed.service';
import { DatabaseService } from '../common/database/database.service';
import { Test, TestingModule } from '@nestjs/testing';
import { News, SubscribedNews } from '@prisma/client';

describe('MyNewsfeedService', () => {
  let myNewsfeedService: MyNewsfeedService;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MyNewsfeedService,
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    myNewsfeedService = app.get<MyNewsfeedService>(MyNewsfeedService);
    databaseService = app.get<DeepMockProxy<DatabaseService>>(DatabaseService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('getMyNewsfeed', () => {
    it('Should return news list and total page', async () => {
      const userId = '1';
      const page = 1;
      const limit = 10;
      const subscribedNewsList: SubscribedNews[] = [
        {
          id: '1',
          userId,
          newsId: '1',
          createdAt: new Date(),
          deletedAt: null,
        },
      ];
      const newsList: News[] = [
        {
          id: '1',
          schoolId: '1',
          title: 'title1',
          content: 'content1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest
        .spyOn(databaseService.subscribedNews, 'findMany')
        .mockResolvedValue(subscribedNewsList);
      jest.spyOn(databaseService.subscribedNews, 'count').mockResolvedValue(1);
      jest.spyOn(databaseService.news, 'findMany').mockResolvedValue(newsList);

      const result = await myNewsfeedService.getMyNewsfeed({
        userId,
        page,
        limit,
      });

      expect(result).toEqual({
        newsList,
        totalPage: 1,
      });
    });
  });
});
