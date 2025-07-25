import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@app/modules/jwt/jwt.interface';
import { encryptPayload } from '@core/utils/jwt-encryption.util';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private preparePayload(payload: JwtPayload) {
    const encrypt = this.configService.get<string>('jwt.encryptPayload') === 'true';

    return encrypt
      ? {
          data: encryptPayload(payload, this.configService.get<string>('jwt.encryption.key'), this.configService.get<string>('jwt.encryption.iv')),
        }
      : payload;
  }

  async generateAccessToken(payload: JwtPayload) {
    const data = this.preparePayload(payload);

    return this.jwtService.signAsync(data, {
      secret: this.configService.get('jwt.access.secret'),
      expiresIn: this.configService.get('jwt.access.expiresIn'),
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    const data = this.preparePayload(payload);

    return this.jwtService.signAsync(data, {
      secret: this.configService.get('jwt.refresh.secret'),
      expiresIn: this.configService.get('jwt.refresh.expiresIn'),
    });
  }

  async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([this.generateAccessToken(payload), this.generateRefreshToken(payload)]);

    return { accessToken, refreshToken };
  }
}
