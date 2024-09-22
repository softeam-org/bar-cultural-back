import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';
import { PaymentMethodsModule } from './payment_methods/payment_methods.module';
import { PaymentTerminalsModule } from './payment_terminals/payment-terminal.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsEventsModule } from './products_events/products_events.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [
    AdministratorsModule,
    CategoriesModule,
    ProductsModule,
    EventsModule,
    SellersModule,
    AuthModule,
    PaymentTerminalsModule,
    ProductsEventsModule,
    SalesModule,
    PaymentMethodsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
