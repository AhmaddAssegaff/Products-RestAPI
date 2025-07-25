import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '@auth/dto/create-account.dto';
import { LoginDto } from '@auth/dto/login-auth.dto';
import { UsersService } from '@users/users.service';
import { user_role } from '@users/interface/users.interface';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../jwt/jwt.interface';
import { JwtTokenService } from '@jwt/jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async createUser(createAccountDto: CreateAccountDto) {
    const { username, password } = createAccountDto;

    await this.userService.findOneUserByUsername(username);
    const hashedPassword = await bcrypt.hash(password, 10);

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

  async UserLogin(LoginDto: LoginDto) {
    return await 'login';
  }

  async createAccessToken() {
    return await 'new Access Token';
  }
}
