import { ApiProperty } from '@nestjs/swagger';


export class PaymentMethod {
  @ApiProperty()
  id: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  sale_id: string;
}
