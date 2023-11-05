import { AbstractTimeRepository } from '..';
import { Time } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/base/database/prisma.service';

@Injectable()
export class TimeRepository implements AbstractTimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTime(logId: string, booleanExit: boolean): Promise<void> {
    this.prisma.time.create({
      data: {
        exit: booleanExit,
        logId,
      },
    });
    return;
  }

  getAllTimes(): Promise<Time[]> {
    return this.prisma.time.findMany();
  }

  findByTime(time: Date): Promise<Time[]> {
    return this.prisma.time.findMany({ where: { createdAt: time } });
  }

  findByLogId(logId: string): Promise<Time[]> {
    return this.prisma.time.findMany({ where: { logId } });
  }

  findByBooleanExit(booleanExit: boolean): Promise<Time[]> {
    return this.prisma.time.findMany({ where: { exit: booleanExit } });
  }

  deleteTimes(logId: string): Promise<void> {
    this.prisma.time.deleteMany({ where: { logId } });
    return;
  }
}
