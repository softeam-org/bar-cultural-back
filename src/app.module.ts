import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';
import { PaymentTerminalsModule } from './payment_terminals/payment-terminal.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsEventsModule } from './products_events/products_events.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    AdministratorsModule,
    CategoriesModule,
    ProductsModule,
    EventsModule,
    PaymentTerminalsModule,
    ProductsEventsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
