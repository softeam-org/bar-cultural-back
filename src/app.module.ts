import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [
    AdministratorsModule,
    CategoriesModule,
    ProductsModule,
    EventsModule,
    SellersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
