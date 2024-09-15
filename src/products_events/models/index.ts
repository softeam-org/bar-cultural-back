import { Prisma } from '@prisma/client';

export const selectProductEvent: Prisma.ProductEventSelect = {
  product_id: true,
  product: true,
  event_id: true,
  event: true,
};
