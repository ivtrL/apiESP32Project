import { Log } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AbstractLogRepository } from '../..';
import { PrismaService } from 'src/base/database/prisma.service';

@Injectable()
export class LogRepository implements AbstractLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(
    logId: string,
    deviceUid: string,
    Authorized: boolean,
    cardUid?: string,
  ): Promise<Log> {
    return await this.prisma.log.create({
      data: {
        cardUid,
        deviceUid,
        logId,
        Authorized,
      },
    });
  }

  async getAllLogs(): Promise<Log[]> {
    return await this.prisma.log.findMany();
  }

  async getLatestAuthorizedLog(cardUid: string): Promise<Log[]> {
    return await this.prisma.log.findMany({
      orderBy: { id: 'desc' },
      where: { Authorized: true, cardUid },
      take: 1,
    });
  }

  async findByLogId(logId: string): Promise<Log> {
    return await this.prisma.log.findUnique({ where: { logId } });
  }

  async findByCardUid(cardUid: string): Promise<Log[]> {
    return await this.prisma.log.findMany({ where: { cardUid } });
  }

  async findByDeviceUid(deviceUid: string): Promise<Log[]> {
    return await this.prisma.log.findMany({ where: { deviceUid } });
  }

  async updateLog(
    logId: string,
    data: { cardUid?: string; deviceUid?: string },
  ): Promise<void> {
    await this.prisma.log.update({ where: { logId }, data });
    return;
  }

  async deleteLog(logId: string): Promise<void> {
    await this.prisma.log.delete({ where: { logId } });
    return;
  }

  async deleteLogs(cardUid: string): Promise<void> {
    await this.prisma.log.deleteMany({ where: { cardUid } });
    return;
  }
}
