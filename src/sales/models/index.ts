import { Prisma } from '@prisma/client';

export const selectSale: Prisma.SaleSelect = {
  id: true,
  event_id: true,
  event: true,
  payment_terminal_id: true,
  payment_terminal: true,
  total_value: true,
  payment_methods: true,
};
