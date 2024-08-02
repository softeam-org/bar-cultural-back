import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class CPFValidationPipe implements PipeTransform<string, string> {
  transform(CPF?: string): string {
    if (CPF && cpf.isValid(CPF)) {
      return CPF;
    }
    throw new BadRequestException('CPF inválido.');
  }
}
