import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { SortOrder } from '@utils/types';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreatePaymentTerminalDto } from './dto/create-payment-terminal.dto';
import { UpdatePaymentTerminalDto } from './dto/update-payment-terminal.dto';
import { PaymentTerminal } from './entities/payment-terminal.entity';

@Injectable()
export class PaymentTerminalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPaymentTerminalDto: CreatePaymentTerminalDto,
  ): Promise<PaymentTerminal> {
    try {
      const paymentTerminal = await this.prisma.payment_terminal.create({
        data: createPaymentTerminalDto,
      });
      return paymentTerminal;
    } catch (err) {
      throw new ConflictException('Terminal de pagamento já existe.');
    }
  }

  async findAll(order?: SortOrder): Promise<PaymentTerminal[]> {
    return await this.prisma.payment_terminal.findMany({
      ...(order && { orderBy: { status: order } }),
    });
  }

  async findOne(id: string): Promise<PaymentTerminal> {
    const paymentTerminal = await this.prisma.payment_terminal.findFirst({
      where: { id },
    });
    if (!paymentTerminal)
      throw new BadRequestException('Terminal de pagamento não existe.');
    return paymentTerminal;
  }

  async update(
    id: string,
    updatePaymentTerminalDto: UpdatePaymentTerminalDto,
  ): Promise<PaymentTerminal> {
    try {
      const paymentTerminal = await this.prisma.payment_terminal.update({
        where: { id },
        data: updatePaymentTerminalDto,
      });
      return paymentTerminal;
    } catch (err) {
      const recordNotFound = 'P2025';
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        recordNotFound == err.code
      ) {
        throw new BadRequestException('Terminal de pagamento não existe.');
      } else throw new ConflictException('Terminal de pagamento já existe.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.payment_terminal.delete({
        where: { id },
      });
    } catch (err) {
      throw new BadRequestException('Terminal de pagamento não existe.');
    }
  }
}
