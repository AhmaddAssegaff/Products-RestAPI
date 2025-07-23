import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Ahmad', description: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  password: string;
}
