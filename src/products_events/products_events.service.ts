import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateProductEventDto } from './dto/create-product_event.dto';
import { ProductEvent } from './entities/product_event.entity';
import { selectProductEvent } from './models';

@Injectable()
export class ProductsEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductEventDto: CreateProductEventDto,
  ): Promise<ProductEvent> {
    try {
      const productEvent = await this.prisma.productEvent.create({
        data: createProductEventDto,
      });
      return productEvent;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('Produto ou evento já existem.');
        }
        const field_name = err.meta?.field_name as string;
        if (field_name.includes('product_id')) {
          throw new BadRequestException('Produto não existe.');
        }
        if (field_name.includes('event_id')) {
          throw new BadRequestException('Evento não existe.');
        }
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async findAllProductInEvent(event_id: string): Promise<ProductEvent> {
    const productEvent = await this.prisma.productEvent.findFirst({
      where: { event_id },
      select: selectProductEvent,
    });
    if (!productEvent) throw new BadRequestException('Evento não existe.');
    return productEvent;
  }

  async remove(product_id: string, event_id: string): Promise<void> {
    try {
      await this.prisma.productEvent.delete({
        where: {
          productEventId: { product_id: product_id, event_id: event_id },
        },
      });
    } catch {
      throw new BadRequestException('Produto e evento não existem.');
    }
  }
}
