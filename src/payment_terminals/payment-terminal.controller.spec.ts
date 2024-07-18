import { Test, TestingModule } from '@nestjs/testing';

import { PaymentTerminalsController } from './payment-terminal.controller';
import { PaymentTerminalsService } from './payment-terminal.service';

describe('PaymentTerminalsController', () => {
  let controller: PaymentTerminalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentTerminalsController],
      providers: [PaymentTerminalsService],
    }).compile();

    controller = module.get<PaymentTerminalsController>(
      PaymentTerminalsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
