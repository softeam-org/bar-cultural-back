import { Prisma } from '@prisma/client';

export const selectProduct: Prisma.ProductSelect = {
  id: true,
  name: true,
  description: true,
  is_active: true,
  categoryId: true,
  category: true,
  amount_in_stock: true,
  value: true,
  created_at: true,
  updated_at: true,
};
