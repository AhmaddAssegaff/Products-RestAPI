import { userRole } from '@core/constants/user.constants';

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
