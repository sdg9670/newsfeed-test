import { MockProxy, mock } from 'jest-mock-extended';
import { MySubscribtionController } from './mySubscribtion.controller';
import { MySubscribtionService } from './mySubscribtion.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthEntity } from '../common/models/auth.model';
import { SubscribtionEntity } from '../common/models/subscribtion.model';

describe('mySubscribtionController', () => {
  let mySubscribtionController: MySubscribtionController;
  let mySubscribtionService: MockProxy<MySubscribtionService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MySubscribtionController],
      providers: [
        {
          provide: MySubscribtionService,
          useValue: mock<MySubscribtionService>(),
        },
      ],
    }).compile();

    mySubscribtionController = app.get<MySubscribtionController>(
      MySubscribtionController,
    );
    mySubscribtionService = app.get<MockProxy<MySubscribtionService>>(
      MySubscribtionService,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('getMySubscribtions', () => {
    it('Should return subscribtions and total page', async () => {
      const userId = '1';
      const page = 1;
      const limit = 10;
      const subscribtions = {
        subscribtions: [],
        totalPage: 1,
      };
      const auth = mock<AuthEntity>();
      auth.user.id = userId;
      mySubscribtionService.getMySubscribtions.mockResolvedValue(subscribtions);

      const result = await mySubscribtionController.getMySubscribtions(auth, {
        page,
        limit,
      });

      expect(result).toEqual(subscribtions);
    });
  });

  describe('subscribe', () => {
    it('Should return subscribtion', async () => {
      const userId = '1';
      const schoolId = '1';
      const subscribtion = mock<SubscribtionEntity>();
      const auth = mock<AuthEntity>();
      auth.user.id = userId;
      mySubscribtionService.subscribe.mockResolvedValue(subscribtion);

      const result = await mySubscribtionController.subscribe(auth, schoolId);

      expect(result).toEqual(subscribtion);
    });
  });

  describe('unsubscribe', () => {
    it('Should return subscribtion', async () => {
      const userId = '1';
      const schoolId = '1';
      const subscribtion = mock<SubscribtionEntity>();
      const auth = mock<AuthEntity>();
      auth.user.id = userId;
      mySubscribtionService.unsubscribe.mockResolvedValue(subscribtion);

      const result = await mySubscribtionController.unsubscribe(auth, schoolId);

      expect(result).toEqual(subscribtion);
    });
  });
});
