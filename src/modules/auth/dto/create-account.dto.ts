import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Ahmad', description: 'username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
