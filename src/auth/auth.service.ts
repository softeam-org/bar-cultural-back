import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    if (seller.password) {
      return await bcrypt.compare(password, seller.password);
    }
    throw new BadRequestException('CPF ou senha inválida.');
  }

  async signIn(dto: LoginSellerDto): Promise<string> {
    const seller = await this.sellerService.findOne(dto.cpf, true);
    if (await this.validateSeller(seller, dto.password)) {
      const payload = { sub: seller.cpf };
      return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException();
  }
}
