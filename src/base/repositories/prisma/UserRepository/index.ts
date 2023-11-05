import { PrismaService } from 'src/base/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { AbstractUserRepository } from '../..';
import { randomBytes } from 'node:crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository implements AbstractUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    email: string,
    password: string,
    name?: string,
  ): Promise<void> {
    const userId = randomBytes(16).toString('hex');

    await this.prisma.user.create({
      data: {
        email,
        password,
        name,
        userId,
      },
    });
    return;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findById(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { userId } });
  }

  async findByEmail(email: string): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { email } });
  }

  async findByName(name: string): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { name } });
  }

  async updateUser(
    userId: string,
    data: { email?: string; password?: string; name?: string },
  ): Promise<void> {
    await this.prisma.user.update({ where: { userId }, data });
    return;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { userId } });
    return;
  }
}
