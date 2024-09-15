import { Test, TestingModule } from '@nestjs/testing';

import { ProductsEventsController } from './products_events.controller';
import { ProductsEventsService } from './products_events.service';

describe('ProductsEventsController', () => {
  let controller: ProductsEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsEventsController],
      providers: [ProductsEventsService],
    }).compile();

    controller = module.get<ProductsEventsController>(ProductsEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
