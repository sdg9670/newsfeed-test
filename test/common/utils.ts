import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import {
  CustomParamFactory,
  DynamicModule,
  ForwardReference,
  INestApplication,
  Type,
} from '@nestjs/common/interfaces';
import { DatabaseModule } from '../../src/common/database/database.module';
import { insertSampleData } from './sampleData';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DatabaseService } from '../../src/common/database/database.service';
import { News, School } from '@prisma/client';

export type CookieMap = { [name: string]: string };
export type SchoolMap = { [schoolName: string]: School };
export type NewsMap = { [newsTitle: string]: News };

export function getParamDecoratorFactory<FactoryOutput = unknown>(
  decorator: (...args: unknown[]) => ParameterDecorator,
): CustomParamFactory<unknown, unknown, FactoryOutput> {
  class Test {
    public test(@decorator() value: unknown) {
      return value;
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

export function getGlobalModules(): (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] {
  return [DatabaseModule];
}

export async function resetData(): Promise<void> {
  await insertSampleData();
}

export function initE2eApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
}

export async function getAdminCookieMap(
  app: INestApplication,
): Promise<CookieMap> {
  const databaseService = app.get<DatabaseService>(DatabaseService);
  const admins = await databaseService.admin.findMany();

  return admins.reduce<CookieMap>((acc, admin) => {
    const auth: { email: string; id: string } = {
      email: admin.email,
      id: admin.id,
    };
    acc[admin.name] = `admin-auth=${JSON.stringify(auth, null, 0)};`;
    return acc;
  }, {});
}

export async function getUserCookieMap(
  app: INestApplication,
): Promise<CookieMap> {
  const databaseService = app.get<DatabaseService>(DatabaseService);
  const users = await databaseService.user.findMany();

  return users.reduce<CookieMap>((acc, user) => {
    const auth: { email: string; id: string } = {
      email: user.email,
      id: user.id,
    };
    acc[user.name] = `user-auth=${JSON.stringify(auth, null, 0)};`;
    return acc;
  }, {});
}

export async function getSchoolMap(app: INestApplication): Promise<SchoolMap> {
  const databaseService = app.get<DatabaseService>(DatabaseService);
  const schools = await databaseService.school.findMany();

  return schools.reduce<SchoolMap>((acc, school) => {
    acc[school.name] = school;
    return acc;
  }, {});
}

export async function getNewsMap(app: INestApplication): Promise<NewsMap> {
  const databaseService = app.get<DatabaseService>(DatabaseService);
  const news = await databaseService.news.findMany();

  return news.reduce<NewsMap>((acc, news) => {
    acc[news.title] = news;
    return acc;
  }, {});
}
