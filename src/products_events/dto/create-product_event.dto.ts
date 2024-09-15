import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductEventDto {
  @ApiProperty({ example: 'c8842595-d05b-47f2-8063-8d1ba71a2abf' })
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: '4f21f2c7-b691-4cf6-beef-b0a3278b109b' })
  @IsNotEmpty()
  @IsUUID()
  event_id: string;
}
