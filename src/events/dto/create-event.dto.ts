import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'guilherme' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: new Date(2025, 6, 12) })
  @IsDateString()
  ended_at: Date;

  @ApiProperty({ example: 'Ivete Sangalo' })
  @IsNotEmpty()
  @IsString()
  attraction: string;

  @ApiProperty({ example: 'Observação' })
  @IsString()
  observations: string;
}
