import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('harus mengembalikan status ok', () => {
      const result = appController.health();
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('ok');
    });
  });
});
