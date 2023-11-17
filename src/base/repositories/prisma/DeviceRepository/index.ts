import { Device } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AbstractDeviceRepository } from '../..';
import { PrismaService } from 'src/base/database/prisma';

@Injectable()
export class DeviceRepository implements AbstractDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDevice(deviceName: string): Promise<void> {
    const deviceUid = randomBytes(16).toString('hex');

    await this.prisma.device.create({
      data: {
        deviceName,
        deviceUid,
      },
    });
    return;
  }

  async getAllDevices(): Promise<Device[]> {
    return await this.prisma.device.findMany();
  }

  async findByDeviceUid(deviceUid: string): Promise<Device> {
    return await this.prisma.device.findUnique({ where: { deviceUid } });
  }

  async findByDeviceName(deviceName: string): Promise<Device[]> {
    return await this.prisma.device.findMany({ where: { deviceName } });
  }

  async updateDevice(deviceUid: string, deviceName: string): Promise<void> {
    await this.prisma.device.update({
      where: { deviceUid },
      data: { deviceName },
    });
    return;
  }

  async deleteDevice(deviceUid: string): Promise<void> {
    await this.prisma.device.delete({ where: { deviceUid } });
    return;
  }
}
