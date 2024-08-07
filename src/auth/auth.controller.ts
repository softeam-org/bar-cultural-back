import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Response } from 'express';

import { LoginSellerDto } from '@src/sellers/dto/login-seller.dto';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  @Post('signin')
  async login(
    @Body() dto: LoginSellerDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.signIn(dto);

    response.cookie('token', token, {
      sameSite: 'strict',
      httpOnly: true,
    });
  }
}
