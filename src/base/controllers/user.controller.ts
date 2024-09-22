import {
  Post,
  Body,
  Controller,
  Res,
  Param,
  Delete,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from 'src/common/dtos/CreateUser';
import { Response } from 'express';
import { User } from '@prisma/client';
import { EditUserDto } from 'src/common/dtos/EditUser';
import { AbstractUserRepository } from '../repositories';

@Controller('api/user')
export class UserController {
  constructor(private userRepository: AbstractUserRepository) {}

  @Post('create')
  async createUser(
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name, imageUrl } = body;
    if (imageUrl) {
      await this.userRepository.createUser(email, password, name, imageUrl);
      return res.status(201).send();
    }

    await this.userRepository.createUser(email, password, name);

    return res.status(201).send();
  }

  @Get()
  async getUsers(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
  ): Promise<User | User[]> {
    if (id) {
      return this.userRepository.findById(id);
    } else if (name) {
      return this.userRepository.findByName(name);
    } else if (email) {
      return this.userRepository.findByEmail(email);
    }
    return this.userRepository.getAllUsers();
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: EditUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name } = body;
    if (!email && !password && !name) {
      return res.status(400).json({ message: 'No data provided' });
    }

    await this.userRepository.updateUser(id, { email, password, name });
    return res.status(200).send();
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
