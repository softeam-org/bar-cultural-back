import { ApiProperty } from '@nestjs/swagger';

export class PaymentTerminal {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;
}
