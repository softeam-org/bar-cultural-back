import { Injectable } from '@nestjs/common';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'CPF', async: true })
@Injectable()
export class CPFValidator implements ValidatorConstraintInterface {
  constructor() {}

  async validate(CPF: string) {
    return cpf.isValid(CPF);
  }

  defaultMessage(): string {
    return 'CPF inválido.';
  }
}
