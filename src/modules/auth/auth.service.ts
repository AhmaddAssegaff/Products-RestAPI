import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '@auth/dto/create-account.dto';
import { LoginDto } from '@auth/dto/login-auth.dto';
import { UsersService } from '@users/users.service';
import { user_role } from '@users/interface/users.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interface/auth.interface';
import { decryptPayload, encryptPayload } from '@core/utils/jwt-encryption.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    const encrypt = this.configService.get('AUTH_JWT_PAYLOAD_ENCRYPT') === 'true';

    const rawPayload = encrypt
      ? { data: encryptPayload(payload, this.configService.get('AUTH_JWT_ENCRYPTION_KEY'), this.configService.get('AUTH_JWT_ENCRYPTION_IV')) }
      : payload;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(rawPayload, {
        secret: this.configService.get('AUTH_JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(rawPayload, {
        secret: this.configService.get('AUTH_JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async createUser(createAccountDto: CreateAccountDto) {
    await this.userService.findOneUserByUsername(createAccountDto.username);
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);

    const user = await this.userService.createUser({
      username: createAccountDto.username,
      password: hashedPassword,
      role: user_role.user,
    });

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const tokens = await this.generateTokens(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      tokens,
    };
  }

  async UserLogin(LoginDto: LoginDto) {
    return await 'login';
  }

  async createAccessToken() {
    return await 'new Access Token';
  }
}
