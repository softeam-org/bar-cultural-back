import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bebidas' })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'Descubra bebidas para todos os gostos: cervejas geladas, vinhos escolhidos a dedo e coquetéis clássicos. Aqui, a hidratação vem com sabor.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
