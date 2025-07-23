import { DatabaseService } from '@app/modules/database/database.service';
import { Injectable } from '@nestjs/common';
import { InterfaceUsers } from '@users/interface/users.interface';
import { QueryResult } from 'pg';
import { CreateUserDto } from '@users/dto/create-user.dto';

const SQL = {
  FIND_ONE_USER: 'SELECT * FROM users WHERE id = $1',
  FIND_ONE_USER_BY_USERNAME: 'SELECT * FROM users WHERE username = $1',
  FIND_ALL_USER: 'SELECT * FROM users',
  CREATE_USER: 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at, updated_at, deleted_at',
};

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto): Promise<InterfaceUsers> {
    const { password, role, username } = createUserDto;
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceUsers> = await pool.query(SQL.CREATE_USER, [username, password, role]);
    return result.rows[0];
  }

  async findAllUser(): Promise<InterfaceUsers[]> {
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceUsers> = await pool.query(SQL.FIND_ALL_USER);
    return result.rows;
  }

  async findOneUser(id: string): Promise<InterfaceUsers> {
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceUsers> = await pool.query(SQL.FIND_ONE_USER, [id]);
    return result.rows[0];
  }

  async findOneUserByUsername(username: string): Promise<InterfaceUsers> {
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceUsers> = await pool.query(SQL.FIND_ONE_USER_BY_USERNAME, [username]);
    return result.rows[0];
  }
}
