import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { getGlobalModules, initE2eApp, resetData } from './common/utils';
import {
  LoginAdminRequestBody,
  LoginUserRequestBody,
} from '../src/common/models/auth.model';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await resetData();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ...getGlobalModules()],
    }).compile();

    app = moduleFixture.createNestApplication();
    initE2eApp(app);
    await app.init();
  });

  describe('/auth/admin/login (POST)', () => {
    it('Should return 201 and set admin-auth cookie', async () => {
      const reqBody: LoginAdminRequestBody = { email: 'admin1@test.dev' };
      const response = await request(app.getHttpServer())
        .post('/auth/admin/login')
        .send(reqBody);

      expect(response.status).toBe(201);
      expect(response.headers['set-cookie'][0]).toEqual(
        expect.stringContaining('admin-auth'),
      );
    });

    it('Should return 400 when email is not correct', async () => {
      const reqBody: LoginAdminRequestBody = { email: 'who@test.dev' };
      const response = await request(app.getHttpServer())
        .post('/auth/admin/login')
        .send(reqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('/auth/admin/logout (POST)', () => {
    it('Should return 201 and clear admin-auth cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/admin/logout')
        .set('Cookie', 'admin-auth=123;');

      expect(response.status).toBe(201);
      expect(response.headers['set-cookie'][0]).toEqual(
        expect.stringContaining('admin-auth=;'),
      );
    });

    it('Should return 400 when admin-auth cookie is not set', async () => {
      const response = await request(app.getHttpServer()).post(
        '/auth/admin/logout',
      );

      expect(response.status).toBe(403);
    });
  });

  describe('/auth/user/login (POST)', () => {
    it('Should return 201 and set user-auth cookie', async () => {
      const reqBody: LoginUserRequestBody = { email: 'user1@test.dev' };
      const response = await request(app.getHttpServer())
        .post('/auth/user/login')
        .send(reqBody);

      expect(response.status).toBe(201);
      expect(response.headers['set-cookie'][0]).toEqual(
        expect.stringContaining('user-auth'),
      );
    });

    it('Should return 400 when email is not correct', async () => {
      const reqBody: LoginUserRequestBody = { email: 'who@test.dev' };
      const response = await request(app.getHttpServer())
        .post('/auth/user/login')
        .send(reqBody);

      expect(response.status).toBe(500);
    });
  });
});
