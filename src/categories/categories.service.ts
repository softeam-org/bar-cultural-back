import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { SortOrder } from '@utils/types';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });
      return category;
    } catch (err) {
      throw new ConflictException('Nome da categoria já existe.');
    }
  }

  async findAll(order?: SortOrder): Promise<Category[]> {
    return await this.prisma.category.findMany({
      ...(order && { orderBy: { name: order } }),
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: { id },
    });
    if (!category) throw new BadRequestException('Categoria não existe.');
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      if (updateCategoryDto.is_active != undefined) {
        await this.prisma.product.updateMany({
          where: { categoryId: id },
          data: { is_active: updateCategoryDto.is_active },
        });
      }
      return category;
    } catch (err) {
      const recordNotFound = 'P2025';
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        recordNotFound == err.code
      ) {
        throw new BadRequestException('Categoria não existe.');
      } else throw new ConflictException('Nome da categoria já existe.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (err) {
      throw new BadRequestException('Categoria não existe.');
    }
  }
}
