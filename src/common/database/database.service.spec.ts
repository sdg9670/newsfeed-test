import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    databaseService = app.get<DatabaseService>(DatabaseService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('onModuleInit', () => {
    it('Should connect to the database', async () => {
      const connectSpy = jest
        .spyOn(databaseService, '$connect')
        .mockResolvedValue();
      await databaseService.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('Should disconnect from the database', async () => {
      const disconnectSpy = jest
        .spyOn(databaseService, '$disconnect')
        .mockResolvedValue();
      await databaseService.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
