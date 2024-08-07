import { ApiProperty } from '@nestjs/swagger';

import { CPFValidator } from '@utils/validation/cpf-cnpj';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';

export class LoginSellerDto {
  @ApiProperty({ description: 'CPF do vendedor', example: '123.456.789-00' })
  @IsNotEmpty()
  @IsString()
  @Validate(CPFValidator)
  cpf: string;

  @ApiProperty({ example: 'pass#j%$wo@!rd' })
  @IsNotEmpty()
  @IsStrongPassword()
  @Transform(({ value }) => value.trim())
  password: string;
}
