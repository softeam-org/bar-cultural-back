import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentTerminalDto {
  @ApiProperty({ example: 'Ativo' })
  @IsNotEmpty()
  @IsString()
  status: string;
}
