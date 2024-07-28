import { Module } from '@nestjs/common';
import { JwtModule }from '@nestjs/jwt'

import { SellersModule } from '@src/sellers/sellers.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SellersModule,
    JwtModule.register({
      secret: '...',
      signOptions: {expiresIn: '60m'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
