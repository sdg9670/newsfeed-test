import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NewsService } from './news.service';
import { DatabaseService } from '../common/database/database.service';
import { Test, TestingModule } from '@nestjs/testing';
import { News, Subscribtion, User } from '@prisma/client';

describe('NewsService', () => {
  let newsService: NewsService;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    newsService = app.get<NewsService>(NewsService);
    databaseService = app.get<DeepMockProxy<DatabaseService>>(DatabaseService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('createNews', () => {
    it('Should return news', async () => {
      const schoolId = '1';
      const title = 'title';
      const content = 'content';
      const adminId = '1';
      const news: News = {
        id: '1',
        title,
        content,
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(true);
      newsService['createSubscribedNews'] = jest.fn();
      jest.spyOn(databaseService.news, 'create').mockResolvedValue(news);

      const result = await newsService.createNews({
        schoolId,
        title,
        content,
        adminId,
      });

      expect(result).toEqual(news);
    });

    it('Should throw an error if the admin does not have this school', async () => {
      const schoolId = '1';
      const title = 'title';
      const content = 'content';
      const adminId = '1';

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(false);

      await expect(
        newsService.createNews({ schoolId, title, content, adminId }),
      ).rejects.toThrow('The admin does not have this school');
    });
  });

  describe('updateNews', () => {
    it('Should return news', async () => {
      const schoolId = '1';
      const newsId = '1';
      const title = 'title';
      const content = 'content';
      const adminId = '1';
      const news: News = {
        id: '1',
        title,
        content,
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(true);
      jest.spyOn(databaseService.news, 'update').mockResolvedValue(news);

      const result = await newsService.updateNews({
        schoolId,
        newsId,
        title,
        content,
        adminId,
      });

      expect(result).toEqual(news);
    });

    it('Should throw an error if the admin does not have this school', async () => {
      const schoolId = '1';
      const newsId = '1';
      const title = 'title';
      const content = 'content';
      const adminId = '1';

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(false);

      await expect(
        newsService.updateNews({ schoolId, newsId, title, content, adminId }),
      ).rejects.toThrow('The admin does not have this school');
    });
  });

  describe('removeNews', () => {
    it('Should return news', async () => {
      const schoolId = '1';
      const newsId = '1';
      const adminId = '1';
      const news: News = {
        id: '1',
        title: 'title',
        content: 'content',
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(true);
      jest.spyOn(databaseService.news, 'update').mockResolvedValue(news);

      const result = await newsService.removeNews({
        schoolId,
        newsId,
        adminId,
      });

      expect(result).toEqual(news);
    });

    it('Should throw an error if the admin does not have this school', async () => {
      const schoolId = '1';
      const newsId = '1';
      const adminId = '1';

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(false);

      await expect(
        newsService.removeNews({ schoolId, newsId, adminId }),
      ).rejects.toThrow('The admin does not have this school');
    });
  });

  describe('getNewsList', () => {
    it('Should return news list by admin', async () => {
      const schoolId = '1';
      const news: News[] = [
        {
          id: '1',
          title: 'title',
          content: 'content',
          schoolId,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(databaseService.news, 'findMany').mockResolvedValue(news);
      jest.spyOn(databaseService.news, 'count').mockResolvedValue(1);
      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(true);

      const result = await newsService.getNewsList({
        schoolId,
        page: 1,
        limit: 10,
        adminId: '1',
      });

      expect(result).toEqual({
        newsList: news,
        totalPage: 1,
      });
    });

    it('Should return news list by user', async () => {
      const schoolId = '1';
      const news: News[] = [
        {
          id: '1',
          title: 'title',
          content: 'content',
          schoolId,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(databaseService.news, 'findMany').mockResolvedValue(news);
      jest.spyOn(databaseService.news, 'count').mockResolvedValue(1);
      newsService['hasSchoolByUser'] = jest.fn().mockResolvedValue(true);

      const result = await newsService.getNewsList({
        schoolId,
        page: 1,
        limit: 10,
        userId: '1',
      });

      expect(result).toEqual({
        newsList: news,
        totalPage: 1,
      });
    });

    it('Should throw an error if the admin does not have this school', async () => {
      const schoolId = '1';

      newsService['hasSchoolByAdmin'] = jest.fn().mockResolvedValue(false);

      await expect(
        newsService.getNewsList({ schoolId, page: 1, limit: 10, adminId: '1' }),
      ).rejects.toThrow('The admin does not have this school');
    });

    it('Should throw an error if the user does not have this school', async () => {
      const schoolId = '1';

      newsService['hasSchoolByUser'] = jest.fn().mockResolvedValue(false);

      await expect(
        newsService.getNewsList({ schoolId, page: 1, limit: 10, userId: '1' }),
      ).rejects.toThrow('The user does not have this school');
    });

    it('Should throw an error if adminId and userId are not provided', async () => {
      const schoolId = '1';

      await expect(
        newsService.getNewsList({ schoolId, page: 1, limit: 10 }),
      ).rejects.toThrow('You must provide adminId or userId');
    });
  });

  describe('hasSchoolByAdmin', () => {
    it('Should return true', async () => {
      const adminId = '1';
      const schoolId = '1';

      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue({
        id: adminId,
        schoolId,
        email: 'email',
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await newsService['hasSchoolByAdmin']({
        adminId,
        schoolId,
      });

      expect(result).toBeTruthy();
    });

    it('Should return false if the admin is not found', async () => {
      const adminId = '1';
      const schoolId = '1';

      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue(null);

      const result = await newsService['hasSchoolByAdmin']({
        adminId,
        schoolId,
      });

      expect(result).toBeFalsy();
    });

    it('Should return false if the admin does not have this school', async () => {
      const adminId = '1';

      jest.spyOn(databaseService.admin, 'findUnique').mockResolvedValue({
        id: adminId,
        schoolId: null,
        email: 'email',
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await newsService['hasSchoolByAdmin']({
        adminId,
        schoolId: '1',
      });

      expect(result).toBeFalsy();
    });
  });

  describe('hasSchoolByUser', () => {
    it('Should return true', async () => {
      const userId = '1';
      const schoolId = '1';

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue({
        id: userId,
        email: 'email',
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscribtions: [
          {
            id: '1',
            userId,
            schoolId,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
      } as User);

      const result = await newsService['hasSchoolByUser']({
        userId,
        schoolId,
      });

      expect(result).toBeTruthy();
    });

    it('Should return false if the user is not found', async () => {
      const userId = '1';
      const schoolId = '1';

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      const result = await newsService['hasSchoolByUser']({
        userId,
        schoolId,
      });

      expect(result).toBeFalsy();
    });

    it('Should return false if the user does not have this school', async () => {
      const userId = '1';

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue({
        id: userId,
        email: 'email',
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscribtions: [],
      } as User);

      const result = await newsService['hasSchoolByUser']({
        userId,
        schoolId: '1',
      });

      expect(result).toBeFalsy();
    });
  });

  describe('createSubscribedNews', () => {
    it('Should create subscribed news', async () => {
      const userId = '1';
      const newsId = '1';
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
      const news: News = {
        id: newsId,
        title: 'title',
        content: 'content',
        schoolId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(databaseService.subscribtion, 'findMany')
        .mockResolvedValue(subscribtions);

      await newsService['createSubscribedNews'](news);

      expect(databaseService.subscribedNews.createMany).toHaveBeenCalledWith({
        data: [
          {
            newsId,
            userId,
            createdAt: news.createdAt,
          },
        ],
      });
    });
  });

  describe('removeSubscribedNews', () => {
    it('Should remove subscribed news', async () => {
      const newsId = '1';
      const news: News = {
        id: newsId,
        title: 'title',
        content: 'content',
        schoolId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      await newsService['removeSubscribedNews'](news);

      expect(databaseService.subscribedNews.updateMany).toHaveBeenCalledWith({
        where: { newsId },
        data: { deletedAt: news.deletedAt },
      });
    });
  });
});
