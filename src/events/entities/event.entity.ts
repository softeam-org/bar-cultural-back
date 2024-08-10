import { ApiProperty } from '@nestjs/swagger';

export class Event {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  ended_at: Date;

  @ApiProperty()
  attraction: string;

  @ApiProperty()
  observations: string;
}
