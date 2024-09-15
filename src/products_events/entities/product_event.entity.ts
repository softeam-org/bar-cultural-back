import { ApiProperty } from '@nestjs/swagger';

import { Event } from '@src/events/entities/event.entity';
import { Product } from '@src/products/entities/product.entity';

export class ProductEvent {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  product?: Product | null;

  @ApiProperty()
  event_id: string;

  @ApiProperty()
  event?: Event | null;
}
