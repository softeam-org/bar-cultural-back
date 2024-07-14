import { Prisma } from "@prisma/client";

export const selectSeller: Prisma.SellerSelect = {
  created_at: true,
  updated_at: true,
  cpf: true,
};