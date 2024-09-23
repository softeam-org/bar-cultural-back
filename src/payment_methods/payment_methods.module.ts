import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import { PaymentMethodsController } from './payment_methods.controller';
import { PaymentMethodsService } from './payment_methods.service';

@Module({
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, PrismaService],
})
export class PaymentMethodsModule {}
