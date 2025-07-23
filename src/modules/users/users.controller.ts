import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUser() {
    return await this.usersService.findAllUser();
  }

  @Get(':id')
  async findOneUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOneUser(id);
  }

  @Get(':username')
  async findOneUserByUsername(@Param('username') id: string) {
    return await this.usersService.findOneUser(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return await this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.usersService.remove(+id);
  // }
}
