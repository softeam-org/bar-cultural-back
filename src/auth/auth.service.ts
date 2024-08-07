import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { LoginSellerDto } from '@src/sellers/dto/login-seller.dto';
import { Seller } from '@src/sellers/entities/seller.entity';
import { SellersService } from '@src/sellers/sellers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sellerService: SellersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateSeller(seller: Seller, password: string): Promise<boolean> {
    return await bcrypt.compare(seller.password, password);
  }

  async signIn(dto: LoginSellerDto): Promise<string> {
    const seller = await this.sellerService.findOne(dto.cpf);
    if (await this.validateSeller(seller, dto.password)) {
      const payload = { sub: seller.cpf };
      return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException();
  }
}
