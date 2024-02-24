import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@src/prisma/prisma.service';
import { SortOrder } from '@src/utils/types/SortOrder';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { selectProduct } from './models';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
        select: selectProduct,
      });
      return product;
    } catch (err) {
      throw new ConflictException('Produto já existe.');
    }
  }

  async findAll(order: SortOrder): Promise<Product[]> {
    return await this.prisma.product.findMany({
      select: selectProduct,
      orderBy: { name: order },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id },
      select: selectProduct,
    });
    if (!product) throw new BadRequestException('Produto não existe.');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        select: selectProduct,
      });
      return product;
    } catch (err) {
      const recordNotFound = 'P2025';
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        recordNotFound == err.code
      ) {
        throw new BadRequestException('Produto não existe.');
      } else throw new ConflictException('Produto já existe.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Produto não existe.');
    }
  }
}
