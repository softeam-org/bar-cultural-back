import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [AdministratorsModule, ProductsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
