import { PartialType } from '@nestjs/swagger';

import { CreatePaymentTerminalDto } from './create-payment-terminal.dto';

export class UpdatePaymentTerminalDto extends PartialType(
  CreatePaymentTerminalDto,
) {}
