import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

import { CreatePaymentTerminalDto } from './dto/create-payment-terminal.dto';
import { UpdatePaymentTerminalDto } from './dto/update-payment-terminal.dto';
import { PaymentTerminal } from './entities/payment-terminal.entity';
import { PaymentTerminalsService } from './payment-terminal.service';

@ApiTags('PaymentTerminals')
@Controller('payment_terminals')
export class PaymentTerminalsController {
  constructor(
    private readonly paymentTerminalsService: PaymentTerminalsService,
  ) {}

  @ApiCreatedResponse({
    description: 'Terminal de pagamento criado com sucesso.',
    type: PaymentTerminal,
  })
  @ApiConflictResponse({
    description: 'Terminal de pagamento já existe.',
  })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createPaymentTerminalDto: CreatePaymentTerminalDto) {
    return this.paymentTerminalsService.create(createPaymentTerminalDto);
  }

  @ApiOkResponse({
    type: PaymentTerminal,
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
    return this.paymentTerminalsService.findAll(order);
  }

  @ApiOkResponse({
    type: PaymentTerminal,
  })
  @ApiBadRequestResponse({ description: 'Terminal de pagamento não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTerminalsService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Terminal de pagamento não existe.' })
  @ApiConflictResponse({
    description: 'Terminal de pagamento já existe.',
  })
  @ApiOkResponse({
    type: PaymentTerminal,
    description: 'Terminal de pagamento atualizado com sucesso.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentTerminalDto: UpdatePaymentTerminalDto,
  ) {
    return this.paymentTerminalsService.update(id, updatePaymentTerminalDto);
  }

  @ApiBadRequestResponse({ description: 'Terminal de pagamento não existe.' })
  @ApiOkResponse({ description: 'Terminal de pagamento removido com sucesso.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTerminalsService.remove(id);
  }
}
