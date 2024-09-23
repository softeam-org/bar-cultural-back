import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { selectSale } from './models';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const sale = await this.prisma.sale.create({
        data: createSaleDto,
        include:{
          payment_methods: true,
        }
      });
      return sale;
    } catch (err) {
      if(err instanceof Prisma.PrismaClientKnownRequestError){
        if (err.code === 'P2002') {
          throw new ConflictException('Venda já existe.');
        }
        const field_name = err.meta?.field_name as string;
        if(field_name.includes('event_id')){
          throw new BadRequestException('Evento não existe.');
        }
        if(field_name.includes('payment_terminal_id')) {
          throw new BadRequestException('Terminal de pagamento não existe');
        }
        if(field_name.includes('seller_id')) {
          throw new BadRequestException('Vendedor não existe.');
        }
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async findAll(): Promise<Sale[]> {
    return await this.prisma.sale.findMany({
      include: {
        payment_methods: true,
      },
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.prisma.sale.findFirst({
      where: { id },
      select: selectSale,
    });
    if (!sale) throw new BadRequestException('Venda não existe.');
    return sale;
  }

  async findEventProfitByPaymentType(
    event_id: string,
    method: string,
  ): Promise<number> {
    const totalProfit = await this.prisma.paymentMethod.aggregate({
      where: {
        method: method,
        sale: {
          event_id: event_id,
        },
      },
      _sum: {
        value: true,
      },
    });

    return totalProfit._sum.value || 0;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.sale.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Venda não existe.');
    }
  }
}
