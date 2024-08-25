import { ApiProperty } from '@nestjs/swagger';

import { Sale } from '@src/sales/entities/sale.entity';

export class PaymentMethod {
  @ApiProperty()
  method: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  sale_id: string;

  @ApiProperty()
  sale?: Sale;
}
