import { Log } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AbstractLogRepository } from '../';
import { PrismaService } from 'src/base/database/prisma.service';

@Injectable()
export class LogRepository implements AbstractLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  createLog(userId: string, deviceUid: string): Promise<void> {
    const logId = randomBytes(16).toString('hex');

    this.prisma.log.create({
      data: {
        userId,
        deviceUid,
        logId,
      },
    });
    return;
  }

  getAllLogs(): Promise<Log[]> {
    return this.prisma.log.findMany();
  }

  findByLogId(logId: string): Promise<Log> {
    return this.prisma.log.findUnique({ where: { logId } });
  }

  findByUserId(userId: string): Promise<Log[]> {
    return this.prisma.log.findMany({ where: { userId } });
  }

  findByDeviceUid(deviceUid: string): Promise<Log[]> {
    return this.prisma.log.findMany({ where: { deviceUid } });
  }

  updateLog(
    logId: string,
    data: { userId?: string; deviceUid?: string },
  ): Promise<void> {
    this.prisma.log.update({ where: { logId }, data });
    return;
  }

  deleteLog(logId: string): Promise<void> {
    this.prisma.log.delete({ where: { logId } });
    return;
  }

  deleteLogs(userId: string): Promise<void> {
    this.prisma.log.deleteMany({ where: { userId } });
    return;
  }
}
