import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'Dinheiro' })
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty({ example: 35.8 })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @IsUUID()
  sale_id: string;
}
