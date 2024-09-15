import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import { PaymentTerminalsController } from './payment-terminal.controller';
import { PaymentTerminalsService } from './payment-terminal.service';

@Module({
  controllers: [PaymentTerminalsController],
  providers: [PaymentTerminalsService, PrismaService],
})
export class PaymentTerminalsModule {}
