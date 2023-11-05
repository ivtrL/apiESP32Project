import { PrismaService } from 'src/base/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { AbstractUserRepository } from '../';
import { randomBytes } from 'node:crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository implements AbstractUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  createUser(email: string, password: string, name?: string): Promise<void> {
    const userId = randomBytes(16).toString('hex');

    this.prisma.user.create({
      data: {
        email,
        password,
        name,
        userId,
      },
    });
    return;
  }

  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findById(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  findByEmail(email: string): Promise<User[]> {
    return this.prisma.user.findMany({ where: { email } });
  }

  findByName(name: string): Promise<User[]> {
    return this.prisma.user.findMany({ where: { name } });
  }

  updateUser(
    userId: string,
    data: { email?: string; password?: string; name?: string },
  ): Promise<void> {
    this.prisma.user.update({ where: { userId }, data });
    return;
  }

  deleteUser(userId: string): Promise<void> {
    this.prisma.user.delete({ where: { userId } });
    return;
  }
}
