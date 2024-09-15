import { Test, TestingModule } from '@nestjs/testing';

import { ProductsEventsService } from './products_events.service';

describe('ProductsEventsService', () => {
  let service: ProductsEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsEventsService],
    }).compile();

    service = module.get<ProductsEventsService>(ProductsEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
