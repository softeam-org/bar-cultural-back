import { ApiProperty } from '@nestjs/swagger';

import { Event } from '@src/events/entities/event.entity';
import { PaymentMethod } from '@src/payment_methods/entities/payment_method.entity';
import { PaymentTerminal } from '@src/payment_terminals/entities/payment-terminal.entity';

export class Sale {
  @ApiProperty()
  id: string;

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