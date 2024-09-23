import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ example: '53055609000' })
  @IsNotEmpty()
  @IsString()
  seller_id: string;

  @ApiProperty({ example: '885be861-b33a-4204-a095-5207198ea6ad' })
  @IsNotEmpty()
  @IsUUID()
  event_id: string;

  @ApiProperty({ example: '15d69237-01c4-4cd8-b7c0-5cb4a9aa7d92' })
  @IsNotEmpty()
  @IsUUID()
  payment_terminal_id: string;

  @ApiProperty({ example: 26.3 })
  @IsNotEmpty()
  @IsNumber()
  total_value: number;
}
