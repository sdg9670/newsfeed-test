import { INestApplication } from '@nestjs/common';
import {
  CookieMap,
  SchoolMap,
  getGlobalModules,
  getSchoolMap,
  getUserCookieMap,
  initE2eApp,
  resetData,
} from './common/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { MySubscribtionModule } from '../src/mySubscribtion/mySubscribtion.module';
import * as request from 'supertest';
import {
  GetSubscribtionsPaginationResponseBody,
  GetSubscribtionsQuery,
  SubscribtionEntity,
} from '../src/common/models/subscribtion.model';

describe('MySubscribtionController (e2e)', () => {
  let app: INestApplication;
  let userCookieMap: CookieMap;
  let schoolMap: SchoolMap;

  beforeEach(async () => {
    await resetData();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MySubscribtionModule, ...getGlobalModules()],
    }).compile();

    app = moduleFixture.createNestApplication();
    initE2eApp(app);
    await app.init();

    userCookieMap = await getUserCookieMap(app);
    schoolMap = await getSchoolMap(app);
  });

  describe('/users/my/subscribtions (GET)', () => {
    it('Should return 200 and my subscribtions', async () => {
      const query: GetSubscribtionsQuery = { page: 1, limit: 2 };
      let response = await request(app.getHttpServer())
        .get('/users/my/subscribtions')
        .query(query)
        .set('Cookie', userCookieMap['user1']);
      let resBody: GetSubscribtionsPaginationResponseBody = response.body;

      expect(response.status).toBe(200);
      expect(resBody.subscribtions.length).toBeLessThanOrEqual(query.limit);
      expect(resBody.totalPage).toBeGreaterThanOrEqual(1);

      query.page = resBody.totalPage + 1;
      response = await request(app.getHttpServer())
        .get('/users/my/subscribtions')
        .query(query)
        .set('Cookie', userCookieMap['user1']);
      resBody = response.body;

      expect(response.status).toBe(200);
      expect(resBody.subscribtions).toHaveLength(0);
    });
  });

  describe('/users/my/subscribtions/:schoolId (POST)', () => {
    it('Should return 201 and subscribe', async () => {
      const school = schoolMap['school1'];
      const response = await request(app.getHttpServer())
        .post(`/users/my/subscribtions/${school.id}`)
        .set('Cookie', userCookieMap['user2']);
      const resBody: SubscribtionEntity = response.body;

      expect(response.status).toBe(201);
      expect(resBody.schoolId).toBe(school.id);
    });

    it('Should return 500 when already subscribed', async () => {
      const school = schoolMap['school2'];
      const response = await request(app.getHttpServer())
        .post(`/users/my/subscribtions/${school.id}`)
        .set('Cookie', userCookieMap['user2']);

      expect(response.status).toBe(500);
    });
  });

  describe('/users/my/subscribtions/:schoolId (DELETE)', () => {
    it('Should return 201 and unsubscribe', async () => {
      const school = schoolMap['school2'];
      const response = await request(app.getHttpServer())
        .delete(`/users/my/subscribtions/${school.id}`)
        .set('Cookie', userCookieMap['user2']);
      const resBody: SubscribtionEntity = response.body;

      expect(response.status).toBe(200);
      expect(resBody.schoolId).toBe(school.id);
      expect(resBody.deletedAt).not.toBeNull();
    });

    it('Should return 500 when not subscribed', async () => {
      const school = schoolMap['school1'];
      const response = await request(app.getHttpServer())
        .delete(`/users/my/subscribtions/${school.id}`)
        .set('Cookie', userCookieMap['user2']);

      expect(response.status).toBe(500);
    });
  });
});
