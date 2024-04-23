import { Module } from '@nestjs/common';

import { CategoriesController } from '@src/categories/categories.controller';
import { CategoriesService } from '@src/categories/categories.service';
import { PrismaService } from '@src/prisma/prisma.service';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [CategoriesController, ProductsController],
  providers: [CategoriesService, ProductsService, PrismaService],
})
export class ProductsModule {}
