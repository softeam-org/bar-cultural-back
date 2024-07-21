import { ApiProperty } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateSellerDto {
  @ApiProperty({description: 'CPF do vendedor', example: '123.456.789-00'})
  @IsNotEmpty()
  @IsString()
  @Length(11, 14)
  cpf: string;

  @ApiProperty({example: 'pass#j%$wo@!rd'})
  @IsNotEmpty()
  @IsStrongPassword()
  @Transform(({value}) => value.trim())
  password: string;
}
