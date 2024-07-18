import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsEnum } from 'class-validator';

enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

export class CreatePaymentTerminalDto {
  @ApiProperty({ example: 'Ativo' })
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
