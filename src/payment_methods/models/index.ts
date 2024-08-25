import { Prisma } from '@prisma/client';

export const selectPaymentMethod: Prisma.PaymentMethodSelect = {
  id: true,
  method: true,
  value: true,
  sale_id: true,
};
