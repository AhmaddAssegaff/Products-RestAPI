import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@users/dto/create-user.dto';
// import { UpdateUserDto } from '@users/dto/update-user.dto';
import { UsersRepository } from '@users/respository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
  }

  async findAllUser() {
    return await this.userRepository.findAllUser();
  }

  async findOneUser(id: string) {
    return await this.userRepository.findOneUser(id);
  }

  async findOneUserByUsername(username: string) {
    return await this.userRepository.findOneUserByUsername(username);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
