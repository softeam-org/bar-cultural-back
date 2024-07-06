import { Prisma } from '@prisma/client';

export const selectPaymentTerminal: Prisma.PaymentTerminalSelect = {
  id: true,
  status: true,
};
