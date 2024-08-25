import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { SalesService } from './sales.service';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiCreatedResponse({
    description: 'Venda criada com sucesso.',
    type: Sale,
  })
  @ApiConflictResponse({ description: 'Venda já existe.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @ApiOkResponse({
    type: Sale,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @ApiOkResponse({
    description: 'Encontrado com sucesso.',
    type: Sale,
  })
  @ApiBadRequestResponse({ description: 'Venda não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Get(':event_id/:payment_method')
  findEventProfitByPaymentType(
    @Param('event_id') event_id: string,
    @Param('payment_method') method: string,
  ) {
    return this.salesService.findEventProfitByPaymentType(event_id, method)
  }

  @ApiBadRequestResponse({ description: 'Venda não existe.' })
  @ApiOkResponse({ description: 'Removido com sucesso.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
