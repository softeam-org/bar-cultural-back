import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import { ProductsEventsController } from './products_events.controller';
import { ProductsEventsService } from './products_events.service';

@Module({
  controllers: [ProductsEventsController],
  providers: [ProductsEventsService, PrismaService],
})
export class ProductsEventsModule {}
