import { Module } from '@nestjs/common';


import { PrismaService } from '@src/prisma/prisma.service';

import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
  controllers: [SellersController],
  providers: [SellersService, PrismaService],
})
export class SellersModule {}
