import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import *  as bcrypt from 'bcrypt'


import { Seller } from '@src/sellers/entities/seller.entity';
import { SellersService } from '@src/sellers/sellers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sellerService: SellersService,
    private readonly jwtService: JwtService,
  ){}

  async validateSeller(cpf: string, pass: string): Promise<Omit<Seller, 'password'> | null > {
    const seller = await this.sellerService.findOne(cpf)
    if (seller && await bcrypt.compare(pass, seller.password)){
      const {...result} = seller;
      return result
    }
    throw new UnauthorizedException();
  }

  async login(seller: Omit<Seller, 'password'>){
    const payload = {sub: seller.cpf};
    return {
      access_token: this.jwtService.sign(payload)
    }

  }
}
