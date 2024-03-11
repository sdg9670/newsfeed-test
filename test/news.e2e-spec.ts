import { INestApplication } from '@nestjs/common';
import {
  CookieMap,
  NewsMap,
  SchoolMap,
  getAdminCookieMap,
  getGlobalModules,
  getNewsMap,
  getSchoolMap,
  getUserCookieMap,
  initE2eApp,
  resetData,
} from './common/utils';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { NewsModule } from '../src/news/news.module';
import {
  CreateNewsRequestBody,
  GetNewsListQuery,
  GetNewsListResponseBody,
  NewsEntity,
} from 'src/common/models/news.model';

describe('NewsController (e2e)', () => {
  let app: INestApplication;
  let userCookieMap: CookieMap;
  let adminCookieMap: CookieMap;
  let schoolMap: SchoolMap;
  let newsMap: NewsMap;

  beforeEach(async () => {
    await resetData();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NewsModule, ...getGlobalModules()],
    }).compile();

    app = moduleFixture.createNestApplication();
    initE2eApp(app);
    await app.init();

    userCookieMap = await getUserCookieMap(app);
    adminCookieMap = await getAdminCookieMap(app);
    schoolMap = await getSchoolMap(app);
    newsMap = await getNewsMap(app);
  });

  describe('/schools/:schoolId/news (POST)', () => {
    it('Should return 201 and create news', async () => {
      const schoolId = schoolMap['school1'].id;
      const reqBody: CreateNewsRequestBody = {
        title: 'title',
        content: 'content',
      };
      const response = await request(app.getHttpServer())
        .post(`/schools/${schoolId}/news`)
        .send(reqBody)
        .set('Cookie', adminCookieMap['admin1']);
      const resBody: NewsEntity = response.body;

      expect(response.status).toBe(201);
      expect(resBody.title).toBe(reqBody.title);
      expect(resBody.content).toBe(reqBody.content);
    });
  });

  describe('/schools/:schoolId/news/:newsId (PUT)', () => {
    it('Should return 200 and update news', async () => {
      const schoolId = schoolMap['school1'].id;
      const newsId = newsMap['news1'].id;
      const reqBody: CreateNewsRequestBody = {
        title: 'title',
        content: 'content',
      };
      const response = await request(app.getHttpServer())
        .put(`/schools/${schoolId}/news/${newsId}`)
        .send(reqBody)
        .set('Cookie', adminCookieMap['admin1']);
      const resBody: NewsEntity = response.body;

      expect(response.status).toBe(200);
      expect(resBody.id).toBe(newsId);
      expect(resBody.title).toBe(reqBody.title);
      expect(resBody.content).toBe(reqBody.content);
    });
  });

  describe('/schools/:schoolId/news/:newsId (DELETE)', () => {
    it('Should return 200 and delete news', async () => {
      const schoolId = schoolMap['school1'].id;
      const newsId = newsMap['news1'].id;
      const response = await request(app.getHttpServer())
        .delete(`/schools/${schoolId}/news/${newsId}`)
        .set('Cookie', adminCookieMap['admin1']);
      const resBody: NewsEntity = response.body;

      expect(response.status).toBe(200);
      expect(resBody.id).toBe(newsId);
      expect(resBody.deletedAt).not.toBeNull();
    });
  });

  describe('/schools/:schoolId/news/admin (GET)', () => {
    it('Should return 200 and get news list', async () => {
      const schoolId = schoolMap['school1'].id;
      const query: GetNewsListQuery = {
        limit: 1,
        page: 1,
      };
      const response = await request(app.getHttpServer())
        .get(`/schools/${schoolId}/news/admin`)
        .query(query)
        .set('Cookie', adminCookieMap['admin1']);

      const resBody: GetNewsListResponseBody = response.body;
      expect(response.status).toBe(200);
      expect(resBody.newsList.length).toBe(1);
      expect(resBody.newsList[0].schoolId).toBe(schoolId);
    });
  });

  describe('/schools/:schoolId/news/user (GET)', () => {
    it('Should return 200 and get news list', async () => {
      const schoolId = schoolMap['school1'].id;
      const query: GetNewsListQuery = {
        limit: 1,
        page: 1,
      };
      const response = await request(app.getHttpServer())
        .get(`/schools/${schoolId}/news/user`)
        .query(query)
        .set('Cookie', userCookieMap['user1']);

      const resBody: GetNewsListResponseBody = response.body;
      expect(response.status).toBe(200);
      expect(resBody.newsList.length).toBe(1);
      expect(resBody.newsList[0].schoolId).toBe(schoolId);
    });
  });
});
