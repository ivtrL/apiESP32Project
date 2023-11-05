/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { UserRepository } from '../repositories/prisma/UserRepository';
import { Response } from 'express';
import { User } from '@prisma/client';
import { EditUserDto } from 'src/common/dtos/EditUser';

@Controller('api')
export class UserController {
  constructor(private UserRepository: UserRepository) {}
  @Post('user/create')
  async createUser(
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, name } = body;
    await this.UserRepository.createUser(email, password, name);
  }

  @Delete('user/delete/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.UserRepository.deleteUser(id);
  }

  @Get('user')
  async getUsers(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
  ): Promise<User | User[]> {
    if (id) {
      return this.UserRepository.findById(id);
    } else if (name) {
      return this.UserRepository.findByName(name);
    } else if (email) {
      return this.UserRepository.findByEmail(email);
    }
    return this.UserRepository.getAllUsers();
  }

  @Put('user/update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: EditUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name } = body;
    if (!email && !password && !name) {
      return res.status(400).json({ message: 'No data provided' });
    }

    await this.UserRepository.updateUser(id, { email, password, name });
    return res.status(200).send();
  }
}
