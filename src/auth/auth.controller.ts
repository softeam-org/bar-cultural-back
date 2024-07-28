import { Controller, Post, Request } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('signin')
  async login(@Request() req){
    return this.authService.login(req.seller)
  }
}
