import { userRole } from '@users/interface/users.interface';

export interface Token {
  refreshToken: string;
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: userRole;
  iat?: number;
  exp?: number;
}

export interface JwtValidatedPayload {
  id: string;
  username: string;
  role: userRole;
}
