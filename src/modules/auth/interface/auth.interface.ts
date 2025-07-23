import { user_role } from '@users/interface/users.interface';

export interface JwtPayload {
  sub: string;
  username: string;
  role: user_role;
  iat?: number;
  exp?: number;
}

export interface JwtValidatedPayload {
  id: string;
  username: string;
  role: user_role;
}
