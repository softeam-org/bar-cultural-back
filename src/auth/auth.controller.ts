import { Controller, Post, Request } from '@nestjs/common';



import { Seller } from '@src/sellers/entities/seller.entity';

import { AuthService } from './auth.service';


interface SellerForLogin extends  Omit<Seller, 'password'> {}
interface RequestWithSeller extends Request{
  seller: SellerForLogin;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('signin')
  async login(@Request() req: RequestWithSeller){
    return this.authService.login(req.seller)
  }
}
