import { ApiProperty } from '@nestjs/swagger';

import { Category } from '@src/categories/entities/category.entity';

export class Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  category?: Category | null;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  value: number;

  @ApiProperty()
  amount_in_stock: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
