import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateProductEventDto } from './dto/create-product_event.dto';
import { ProductEvent } from './entities/product_event.entity';
import { ProductsEventsService } from './products_events.service';

@ApiTags('ProductsEvents')
@Controller('products-events')
export class ProductsEventsController {
  constructor(private readonly productsEventsService: ProductsEventsService) {}

  @ApiCreatedResponse({
    description: 'Criado com sucesso.',
    type: ProductEvent,
  })
  @ApiConflictResponse({ description: 'Produto e evento já existem.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createProductEventDto: CreateProductEventDto) {
    return this.productsEventsService.create(createProductEventDto);
  }

  @ApiOkResponse({
    description: 'Encontrado com sucesso.',
    type: ProductEvent,
  })
  @ApiBadRequestResponse({ description: 'Evento não existe.' })
  @Get(':event_id')
  findAllProductInEvent(@Param('event_id') event_id: string) {
    return this.productsEventsService.findAllProductInEvent(event_id);
  }

  @ApiBadRequestResponse({ description: 'Produto e Evento não existem.' })
  @ApiOkResponse({ description: 'Removido com sucesso.' })
  @Delete(':product_id/:event_id')
  remove(
    @Param('product_id') product_id: string,
    @Param('event_id') event_id: string,
  ) {
    return this.productsEventsService.remove(product_id, event_id);
  }
}
