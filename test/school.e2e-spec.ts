import { INestApplication } from '@nestjs/common';
import {
  CookieMap,
  SchoolMap,
  getAdminCookieMap,
  getGlobalModules,
  getSchoolMap,
  initE2eApp,
  resetData,
} from './common/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSchoolRequestBody } from '../src/common/models/school.model';
import * as request from 'supertest';
import { SchoolModule } from '../src/school/school.module';

describe('SchoolController (e2e)', () => {
  let app: INestApplication;
  let adminCookieMap: CookieMap;
  let schoolMap: SchoolMap;

  beforeEach(async () => {
    await resetData();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SchoolModule, ...getGlobalModules()],
    }).compile();

    app = moduleFixture.createNestApplication();
    initE2eApp(app);
    await app.init();

    adminCookieMap = await getAdminCookieMap(app);
    schoolMap = await getSchoolMap(app);
  });

  describe('/schools (POST)', () => {
    it('Should return 201 and create a school', async () => {
      const reqBody: CreateSchoolRequestBody = {
        name: 'school999',
        location: 'location999',
      };
      const response = await request(app.getHttpServer())
        .post('/schools')
        .send(reqBody)
        .set('Cookie', adminCookieMap['admin3']);
      const resBody = response.body;

      expect(response.status).toBe(201);
      expect(resBody.name).toBe(reqBody.name);
      expect(resBody.location).toBe(reqBody.location);
    });

    it('Should return 500 when the school is already exist', async () => {
      const school = schoolMap['school1'];
      const reqBody: CreateSchoolRequestBody = {
        name: school.name,
        location: school.location,
      };
      const response = await request(app.getHttpServer())
        .post('/schools')
        .send(reqBody)
        .set('Cookie', adminCookieMap['admin3']);

      expect(response.status).toBe(500);
    });
  });
});
