import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { PaymentMethod } from './entities/payment_method.entity';
import { selectPaymentMethod } from './models';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    try {
      const paymentMethod = await this.prisma.paymentMethod.create({
        data: createPaymentMethodDto,
      });
      return paymentMethod;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code == 'P2003') {
          throw new BadRequestException('Venda não existe.');
        }
      }
      throw new InternalServerErrorException("Server Error");
    }
  }

  async findAllPaymentMethodsInSale(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id },
      select: selectPaymentMethod,
    });
    if (!paymentMethod) throw new BadRequestException('Método de pagamento não existe.');

    return paymentMethod;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.paymentMethod.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Método de pagamento não existe.');
    }
  }
}
