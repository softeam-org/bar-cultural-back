import { Prisma } from '@prisma/client';

export const selectPaymentTerminal: Prisma.Payment_terminalSelect = {
  id: true,
  status: true,
};
