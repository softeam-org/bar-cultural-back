import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateSellerDto {
  @ApiProperty({example: '12345678901'})
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({example: 'pass#j%$wo@!rd'})
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
