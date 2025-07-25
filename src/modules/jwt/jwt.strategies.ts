import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@app/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtValidatedPayload } from '@app/modules/jwt/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.encryption.key'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtValidatedPayload> {
    const user = await this.usersService.findOneUser(payload.username);

    if (!user) {
      throw new UnauthorizedException('user Unauthorized');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
