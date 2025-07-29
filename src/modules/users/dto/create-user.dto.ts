import { ApiProperty } from '@nestjs/swagger';
import { InterfaceCreateUsersInput, userRole } from '@users/interface/users.interface';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto implements InterfaceCreateUsersInput {
  @ApiProperty({ example: 'Ahmad', description: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Password123', description: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'user', description: 'role' })
  @IsString()
  @IsEnum(userRole)
  role: userRole;
}
