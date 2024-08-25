import { Prisma } from '@prisma/client';

export const selectPaymentMethod: Prisma.PaymentMethodSelect = {
  method: true,
  value: true,
  sale_id: true,
  sale: true,
};
