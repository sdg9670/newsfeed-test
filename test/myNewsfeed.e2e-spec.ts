import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  CookieMap,
  getGlobalModules,
  getUserCookieMap,
  initE2eApp,
  resetData,
} from './common/utils';
import { MyNewsfeedModule } from '../src/myNewsfeed/myNewsfeed.module';
import {
  GetMyNewsfeedQuery,
  GetMyNewsfeedResponseBody,
} from '../src/common/models/newsfeed.model';
import * as request from 'supertest';

describe('MyNewsfeedController (e2e)', () => {
  let app: INestApplication;
  let userCookies: CookieMap;

  beforeEach(async () => {
    await resetData();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MyNewsfeedModule, ...getGlobalModules()],
    }).compile();

    app = moduleFixture.createNestApplication();
    initE2eApp(app);
    await app.init();

    userCookies = await getUserCookieMap(app);
  });

  describe('/users/my/newsfeed/news (GET)', () => {
    it('Should return 200 and newsfeed', async () => {
      const query: GetMyNewsfeedQuery = { page: 1, limit: 2 };

      let response = await request(app.getHttpServer())
        .get('/users/my/newsfeed/news')
        .query(query)
        .set('Cookie', userCookies['user1']);
      let resBody: GetMyNewsfeedResponseBody = response.body;

      expect(response.status).toBe(200);
      expect(resBody.newsList.length).toBeLessThanOrEqual(query.limit);
      expect(resBody.totalPage).toBe(2);

      query.page = resBody.totalPage + 1;
      response = await request(app.getHttpServer())
        .get('/users/my/newsfeed/news')
        .query(query)
        .set('Cookie', userCookies['user1']);
      resBody = response.body;

      expect(response.status).toBe(200);
      expect(resBody.newsList).toHaveLength(0);
    });

    it('Should not return the news before subscribed', async () => {
      const query: GetMyNewsfeedQuery = { page: 1, limit: 100 };

      const response = await request(app.getHttpServer())
        .get('/users/my/newsfeed/news')
        .query(query)
        .set('Cookie', userCookies['user1']);
      const resBody: GetMyNewsfeedResponseBody = response.body;
      const wrongNews = resBody.newsList.filter(
        (news) => news.id === 'news1' || news.id === 'news4',
      );

      expect(response.status).toBe(200);
      expect(wrongNews).toHaveLength(0);
    });
  });
});
