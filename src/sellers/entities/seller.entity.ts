import { ApiProperty } from "@nestjs/swagger";

export class Seller {
  @ApiProperty()
  cpf: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
