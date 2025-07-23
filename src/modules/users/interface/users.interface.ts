export enum user_role {
  user = 'user',
  admin = 'admin',
}

export interface InterfaceUsers {
  id: string;
  username: string;
  password: string;
  role: user_role;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface InterfaceCreateUsersInput {
  username: string;
  password: string;
  role: user_role;
}
