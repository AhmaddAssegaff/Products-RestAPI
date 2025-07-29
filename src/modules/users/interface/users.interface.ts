import { userRole } from '@core/constants/user.constants';

export interface InterfaceUsers {
  id: string;
  username: string;
  password: string;
  role: userRole;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface InterfaceCreateUsersInput {
  username: string;
  password: string;
  role: userRole;
}
