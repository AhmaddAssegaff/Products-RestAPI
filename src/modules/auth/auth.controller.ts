import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { CreateAccountDto } from '@auth/dto/create-account.dto';
import { LoginDto } from '@auth/dto/login-auth.dto';
import { Cookies } from '@app/core/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createAccountDto: CreateAccountDto) {
    return await this.authService.createUser(createAccountDto);
  }

  @Post('login')
  async UserLogin(@Body() loginDto: LoginDto) {
    return await this.authService.UserLogin(loginDto);
  }

  @Post('refresh-token')
  async refresh(@Cookies('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
