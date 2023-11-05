import { Log } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AbstractLogRepository } from '../';
import { PrismaService } from 'src/base/database/prisma.service';

@Injectable()
export class LogRepository implements AbstractLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(userId: string, deviceUid: string): Promise<void> {
    const logId = randomBytes(16).toString('hex');

    await this.prisma.log.create({
      data: {
        userId,
        deviceUid,
        logId,
      },
    });
    return;
  }

  async getAllLogs(): Promise<Log[]> {
    return await this.prisma.log.findMany();
  }

  async findByLogId(logId: string): Promise<Log> {
    return await this.prisma.log.findUnique({ where: { logId } });
  }

  async findByUserId(userId: string): Promise<Log[]> {
    return await this.prisma.log.findMany({ where: { userId } });
  }

  async findByDeviceUid(deviceUid: string): Promise<Log[]> {
    return await this.prisma.log.findMany({ where: { deviceUid } });
  }

  async updateLog(
    logId: string,
    data: { userId?: string; deviceUid?: string },
  ): Promise<void> {
    await this.prisma.log.update({ where: { logId }, data });
    return;
  }

  async deleteLog(logId: string): Promise<void> {
    await this.prisma.log.delete({ where: { logId } });
    return;
  }

  async deleteLogs(userId: string): Promise<void> {
    await this.prisma.log.deleteMany({ where: { userId } });
    return;
  }
}
