import { MockProxy, mock } from 'jest-mock-extended';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateNewsRequestBody,
  GetNewsListResponseBody,
} from '../common/models/news.model';
import { AuthEntity } from '../common/models/auth.model';
import { News } from '@prisma/client';

describe('NewsController', () => {
  let newsController: NewsController;
  let newsService: MockProxy<NewsService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: mock<NewsService>(),
        },
      ],
    }).compile();

    newsController = app.get<NewsController>(NewsController);
    newsService = app.get<MockProxy<NewsService>>(NewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('createNews', () => {
    it('Should return a news', async () => {
      const body: CreateNewsRequestBody = {
        title: 'title',
        content: 'content',
      };
      const auth = mock<AuthEntity>();
      auth.admin.id = '1';
      const schoolId = '1';
      const news: News = {
        id: '1',
        title: body.title,
        content: body.content,
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      jest.spyOn(newsService, 'createNews').mockResolvedValue(news);
      const result = await newsController.createNews(auth, schoolId, body);

      expect(result).toEqual(news);
    });
  });

  describe('updateNews', () => {
    it('Should return a news', async () => {
      const body: CreateNewsRequestBody = {
        title: 'title',
        content: 'content',
      };
      const auth = mock<AuthEntity>();
      auth.admin.id = '1';
      const schoolId = '1';
      const newsId = '1';
      const news: News = {
        id: '1',
        title: body.title,
        content: body.content,
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      jest.spyOn(newsService, 'updateNews').mockResolvedValue(news);
      const result = await newsController.updateNews(
        auth,
        schoolId,
        newsId,
        body,
      );

      expect(result).toEqual(news);
    });
  });

  describe('removeNews', () => {
    it('Should return a news', async () => {
      const auth = mock<AuthEntity>();
      auth.admin.id = '1';
      const schoolId = '1';
      const newsId = '1';
      const news: News = {
        id: '1',
        title: 'title',
        content: 'content',
        schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      jest.spyOn(newsService, 'removeNews').mockResolvedValue(news);
      const result = await newsController.removeNews(auth, schoolId, newsId);

      expect(result).toEqual(news);
    });
  });

  describe('getNewsListByAdmin', () => {
    it('Should return a list of news', async () => {
      const auth = mock<AuthEntity>();
      auth.admin.id = '1';
      const schoolId = '1';
      const news: GetNewsListResponseBody = {
        newsList: [
          {
            id: '1',
            title: 'title',
            content: 'content',
            schoolId,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        totalPage: 1,
      };
      jest.spyOn(newsService, 'getNewsList').mockResolvedValue(news);
      const result = await newsController.getNewsListByAdmin(auth, schoolId, {
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(news);
    });
  });

  describe('getNewsListByUser', () => {
    it('Should return a list of news', async () => {
      const auth = mock<AuthEntity>();
      auth.user.id = '1';
      const schoolId = '1';
      const news: GetNewsListResponseBody = {
        newsList: [
          {
            id: '1',
            title: 'title',
            content: 'content',
            schoolId,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        totalPage: 1,
      };
      jest.spyOn(newsService, 'getNewsList').mockResolvedValue(news);
      const result = await newsController.getNewsListByUser(auth, schoolId, {
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(news);
    });
  });
});
