import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { UsersRepository } from '@users/respository/users.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
