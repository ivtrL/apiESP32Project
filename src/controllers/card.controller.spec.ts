import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';

describe('CardController', () => {
  let cardController: CardController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [],
    }).compile();

    cardController = app.get<CardController>(CardController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cardController.getHello()).toBe('Hello World!');
    });
  });
});
