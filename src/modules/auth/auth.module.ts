import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { UsersModule } from '@users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenModule } from '@jwt/jwt-token.module';
import { JwtStrategy } from '@jwt/jwt.strategies';

@Module({
  imports: [UsersModule, ConfigModule, JwtTokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
