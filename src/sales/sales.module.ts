import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, PrismaService],
})
export class SalesModule {}
