import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Martíni' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'e134362f-72c9-4fd8-a70f-4c4a44cf7c55' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example:
      'Coquetel feito com gim e vermute seco, mexidos com gelo e coado em uma taça cocktail sem gelo',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '20.5' })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({ example: 13 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount_in_stock: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
