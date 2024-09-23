import { ApiProperty } from '@nestjs/swagger';

import { Event } from '@src/events/entities/event.entity';
import { PaymentMethod } from '@src/payment_methods/entities/payment_method.entity';
import { PaymentTerminal } from '@src/payment_terminals/entities/payment-terminal.entity';
import { Seller } from '@src/sellers/entities/seller.entity';

export class Sale {
  @ApiProperty()
  id: string;

  @ApiProperty()
  seller_id: string;

  @ApiProperty()
  seller?: Seller;

  @ApiProperty()
  event_id: string;

  @ApiProperty()
  event?: Event;

  @ApiProperty()
  payment_terminal_id: string;

  @ApiProperty()
  payment_terminal?: PaymentTerminal;

  @ApiProperty()
  payment_methods: PaymentMethod[];

  @ApiProperty()
  total_value: number;
}