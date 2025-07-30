import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '@auth/dto/create-account.dto';
import { LoginDto } from '@auth/dto/login-auth.dto';
import { UsersService } from '@users/users.service';
import { userRole } from '@core/constants/user.constants';
import { JwtPayload } from '@jwt/jwt.interface';
import { JwtTokenService } from '@jwt/jwt-token.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@core/exceptions/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async createUser(createAccountDto: CreateAccountDto) {
    const { username, password } = createAccountDto;

    const existingUser = await this.userService.findOneUserByUsername(username);

    if (existingUser) {
      throw new ConflictException('test Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      username: createAccountDto.username,
      password: hashedPassword,
      role: userRole.user,
    });

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const tokens = await this.jwtTokenService.generateTokens(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      tokens,
    };
  }

  async UserLogin(loginDto: LoginDto) {
    const { password, username } = loginDto;

    const user = await this.userService.findOneUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException({
        code: 'USERNAME_NOT_FOUND',
        message: 'Invalid credentials',
        description: 'username tidak di temukan',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException({
        code: 'PASSWORD_INCORRECT',
        message: 'Invalid credentials',
        description: 'password salah',
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const tokens = await this.jwtTokenService.generateTokens(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = await this.jwtTokenService.verifyRefreshToken(refreshToken);
    const user = await this.userService.findOneUserByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_FAILED',
        message: 'user not found',
      });
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const tokens = await this.jwtTokenService.generateTokens(newPayload);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      tokens,
    };
  }
}
