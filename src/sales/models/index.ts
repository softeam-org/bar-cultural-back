import { Prisma } from '@prisma/client';

import { createSelection } from '@src/sellers/models';

export const selectSale: Prisma.SaleSelect = {
  id: true,
  seller_id: true,
  seller: { select: createSelection(false) },
  event_id: true,
  event: true,
  payment_terminal_id: true,
  payment_terminal: true,
  total_value: true,
  payment_methods: true,
};
