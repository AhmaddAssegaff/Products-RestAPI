import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@jwt/jwt.interface';
import { decryptPayload, encryptPayload } from '@core/utils/jwt-encryption.util';

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

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const secret = this.configService.get<string>('jwt.refresh.secret');
    const decoded = await this.jwtService.verifyAsync(refreshToken, { secret });

    if ('data' in decoded) {
      const decrypted = decryptPayload(decoded.data, this.configService.get<string>('jwt.encryption.key'), this.configService.get<string>('jwt.encryption.iv'));

      return decrypted;
    }

    return decoded;
  }
}
