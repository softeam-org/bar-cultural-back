import { Prisma } from '@prisma/client';

export const createSelection: (password: boolean) => Prisma.SellerSelect = (
  password: boolean,
) => {
  return {
    created_at: true,
    updated_at: true,
    password,
    cpf: true,
  };
};
