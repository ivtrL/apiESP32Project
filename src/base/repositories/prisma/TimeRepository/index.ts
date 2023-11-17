import { AbstractTimeRepository } from '../..';
import { Time } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/base/database/prisma';

@Injectable()
export class TimeRepository implements AbstractTimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTime(logId: string, booleanExit: boolean): Promise<void> {
    await this.prisma.time.create({
      data: {
        exit: booleanExit,
        logId,
      },
    });
    return;
  }

  async getAllTimes(): Promise<Time[]> {
    return await this.prisma.time.findMany();
  }

  async findByTime(time: Date): Promise<Time[]> {
    return await this.prisma.time.findMany({ where: { createdAt: time } });
  }

  async findByLogId(logId: string): Promise<Time[]> {
    return await this.prisma.time.findMany({ where: { logId } });
  }

  async findByBooleanExit(booleanExit: boolean): Promise<Time[]> {
    return await this.prisma.time.findMany({ where: { exit: booleanExit } });
  }

  async deleteTimes(logId: string): Promise<void> {
    await this.prisma.time.deleteMany({ where: { logId } });
    return;
  }
}
