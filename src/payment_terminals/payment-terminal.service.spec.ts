import { Test, TestingModule } from '@nestjs/testing';

import { PaymentTerminalsService } from './payment-terminal.service';

describe('PaymentTerminalsService', () => {
  let service: PaymentTerminalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentTerminalsService],
    }).compile();

    service = module.get<PaymentTerminalsService>(PaymentTerminalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
