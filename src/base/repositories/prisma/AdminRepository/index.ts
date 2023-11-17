import { randomUUID } from 'node:crypto';
import { AbstractAdminRepository } from '../..';
import { PrismaService } from 'src/base/database/prisma';
import { Admin } from '@prisma/client';

export class AdminRepository implements AbstractAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(
    email: string,
    password: string,
    name?: string,
  ): Promise<void> {
    const AdminId = randomUUID();
    await this.prisma.admin.create({
      data: {
        email,
        password,
        name,
        AdminId,
      },
    });
    return;
  }

  async findByEmail(email: string): Promise<Admin> {
    return await this.prisma.admin.findUnique({ where: { email } });
  }

  async findById(AdminId: string): Promise<Admin> {
    return await this.prisma.admin.findUnique({ where: { AdminId } });
  }

  async updateAdmin(
    AdminId: string,
    data: { email?: string; password?: string; name?: string },
  ): Promise<void> {
    await this.prisma.admin.update({ where: { AdminId }, data });
    return;
  }

  async deleteAdmin(AdminId: string): Promise<void> {
    await this.prisma.admin.delete({ where: { AdminId } });
    return;
  }
}
