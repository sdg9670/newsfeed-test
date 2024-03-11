import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { MyNewsfeedController } from './myNewsfeed.controller';
import { MyNewsfeedService } from './myNewsfeed.service';
import { AuthEntity } from '../common/models/auth.model';

describe('MyNewsfeedController', () => {
  let myNewsfeedController: MyNewsfeedController;
  let myNewsfeedService: MockProxy<MyNewsfeedService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MyNewsfeedController],
      providers: [
        {
          provide: MyNewsfeedService,
          useValue: mock<MyNewsfeedService>(),
        },
      ],
    }).compile();

    myNewsfeedController = app.get<MyNewsfeedController>(MyNewsfeedController);
    myNewsfeedService =
      app.get<MockProxy<MyNewsfeedService>>(MyNewsfeedService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('getMyNewsfeed', () => {
    it('Should return news list and total page', async () => {
      const auth = mock<AuthEntity>();
      auth.user = {
        id: '1',
        email: 'test1@test.dev',
      };
      const page = 1;
      const limit = 10;
      const newsList = [
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
      const totalPage = 1;
      myNewsfeedService.getMyNewsfeed.mockResolvedValue({
        newsList,
        totalPage,
      });
      const result = await myNewsfeedController.getMyNewsfeed(auth, {
        page,
        limit,
      });

      expect(result).toEqual({ newsList, totalPage });
    });
  });
});
