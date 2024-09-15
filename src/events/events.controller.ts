import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ParseSortOrderPipe } from '@utils/pipes';
import { SortOrder } from '@utils/types';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiCreatedResponse({
    description: 'Evento criado com sucesso.',
    type: Event,
  })
  @ApiConflictResponse({ description: 'Evento já existe' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida' })
  @Post()
  create(@Body() createEvetDto: CreateEventDto) {
    return this.eventsService.create(createEvetDto);
  }

  @ApiOkResponse({
    type: Event,
    isArray: true,
  })
  @Get()
  @ApiQuery({
    name: 'order',
    type: String,
    description:
      "Deve ser passado 'asc' ou vazio para retornar os dados ordenados em ordem crescente ou 'desc' para retornar em ordem descrescente com base no nome",
    required: false,
  })
  findAll(@Query('order', ParseSortOrderPipe) order?: SortOrder) {
    return this.eventsService.findAll(order);
  }

  @ApiOkResponse({
    type: Event,
  })
  @ApiBadRequestResponse({ description: 'Evento não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Evento não existe' })
  @ApiConflictResponse({ description: 'Nome do evento já existe' })
  @ApiOkResponse({
    type: Event,
    description: 'Evento atualizado com sucesso',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiBadRequestResponse({ description: 'Evento não existe' })
  @ApiOkResponse({ description: 'Evento removido com sucesso' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
