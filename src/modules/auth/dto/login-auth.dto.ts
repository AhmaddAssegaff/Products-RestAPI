import { CreateAccountDto } from '@auth/dto/create-account.dto';
import { PartialType } from '@nestjs/swagger';

export class LoginDto extends PartialType(CreateAccountDto) {}
