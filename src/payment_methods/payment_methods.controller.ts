import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { PaymentMethod } from './entities/payment_method.entity';
import { PaymentMethodsService } from './payment_methods.service';

@ApiTags('PaymentMethods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }

  @ApiCreatedResponse({
    description: 'Método de pagamento criado com sucesso.',
    type: PaymentMethod,
  })
  @ApiConflictResponse({ description: 'Método de pagamento já existe.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodsService.create(createPaymentMethodDto);
  }

  @ApiOkResponse({
    description: 'Encontrado com sucesso.',
    type: PaymentMethod,
  })
  @ApiBadRequestResponse({ description: 'Método de pagamento não existe' })
  @Get(':id')
  findAllPaymentMethodsInSale(@Param('id') sale_id: string) {
    return this.paymentMethodsService.findAllPaymentMethodsInSale(sale_id);
  }

  @ApiBadRequestResponse({ description: 'Método de pagamento não existe.' })
  @ApiOkResponse({ description: 'Removido com sucesso.' })
  @Delete(':id')
  remove(@Param('id') sale_id: string) {
    return this.paymentMethodsService.remove(sale_id);
  }
}
