import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { SortOrder } from '@utils/types';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { selectProduct } from './models';
import { Category } from '@src/categories/entities/category.entity';
import { CreateCategoryDto } from '@src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@src/categories/dto/update-category.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
      });
      return product;
    } catch (err) {
      throw new ConflictException('Produto já existe.');
    }
  }

  async findAll(order?: SortOrder): Promise<Product[]> {
    return await this.prisma.product.findMany({
      select: selectProduct,
      ...(order && { orderBy: { name: order } }),
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
      const existProduct = await this.prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!existProduct) {
        throw new NotFoundException('Produto não existe.');
      }

      if (updateProductDto.is_active !== undefined) {
        if (!existProduct.category.is_active && updateProductDto.is_active) {
          throw new BadRequestException(
            'Não é possível atualizar o status do produto.',
          );
        }
      }
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        select: selectProduct,
      });
      return product;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Produto não existe.');
        } else if (err.code === 'P2002') {
          throw new ConflictException('Produto já existe.');
        }
      }
      throw new BadRequestException('Produto não existe.');
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
