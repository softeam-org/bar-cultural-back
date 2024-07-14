import { 
  BadRequestException,
  ConflictException,
  Injectable,
 } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';


import { PrismaService } from '@src/prisma/prisma.service';

import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './entities/seller.entity';
import { selectSeller } from './models';

@Injectable()
export class SellersService {
  constructor(private readonly prisma: PrismaService){}

  async create(
    createSellerDto: CreateSellerDto,
  ): Promise<Seller> {
    try{
      const {password} = createSellerDto;
      const roundsOfHashing = 10;
      const hashedPassword = await hash(String(password), roundsOfHashing);
      createSellerDto.password = hashedPassword;

      const seller = await this.prisma.seller.create({
        data: createSellerDto,
        select: selectSeller,
      });
      return seller;
    } catch(err){
      throw new ConflictException('CPF já existe.');
    }
  }

  async findAll(): Promise<Seller[]> {
    return await this.prisma.seller.findMany({
      select: selectSeller
    });
  }

  async findOne(cpf: string): Promise<Seller> {
    const seller = await this.prisma.seller.findFirst({
      where: {cpf},
      select: selectSeller,
    });
    if (!seller)
        throw new BadRequestException('Vendedor não existe.');
    return seller;
  }

  async update(cpf: string, updateSellerDto: UpdateSellerDto): Promise<Seller> {
    try{
      delete updateSellerDto.password;
      const seller = await this.prisma.seller.update({
        where: {cpf},
        data: updateSellerDto,
        select: selectSeller,
      });
      return seller;
    } catch (err) {
      const recordNotFound = 'P2025';
      if(
        err instanceof Prisma.PrismaClientKnownRequestError &&
        recordNotFound == err.code
      ){
        throw new BadRequestException('Vendedor não existe.');
      } else throw new ConflictException('CPF já existe.');
    }
  }

  async remove(cpf: string): Promise<void> {
    try{
      await this.prisma.seller.delete({where: {cpf}});
    }catch (err){
      throw new BadRequestException('Vendedor não existe.');
    }
  }
}
