import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CPFValidationPipe } from '@utils/pipes/CPFValidationPipe';

import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './entities/seller.entity';
import { SellersService } from './sellers.service';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @ApiCreatedResponse({
    description: 'Criado com sucesso.',
    type: Seller,
  })
  @ApiConflictResponse({ description: 'CPF já existe.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @ApiOkResponse({
    type: Seller,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @ApiOkResponse({
    description: 'Encontrado com sucesso',
    type: Seller,
  })
  @ApiBadRequestResponse({ description: 'Vendedor não existe.' })
  @Get(':cpf')
  findOne(@Param('cpf', CPFValidationPipe) cpf: string) {
    return this.sellersService.findOne(cpf);
  }

  @ApiBadRequestResponse({ description: 'Vendedor não existe.' })
  @ApiConflictResponse({ description: 'Cpf já existe.' })
  @ApiOkResponse({
    description: 'Atualizado com sucesso.',
    type: Seller,
  })
  @Patch(':cpf')
  update(
    @Param('cpf', CPFValidationPipe) cpf: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellersService.update(cpf, updateSellerDto);
  }

  @ApiBadRequestResponse({ description: 'Vendedor não existe.' })
  @ApiOkResponse({ description: 'Removido com sucesso.' })
  @Delete(':cpf')
  remove(@Param('cpf', CPFValidationPipe) cpf: string) {
    return this.sellersService.remove(cpf);
  }
}
