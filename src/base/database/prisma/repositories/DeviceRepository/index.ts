import { Device } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AbstractDeviceRepository } from '../';
import { PrismaService } from 'src/base/database/prisma.service';

@Injectable()
export class DeviceRepository implements AbstractDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  createDevice(deviceName: string): Promise<void> {
    const deviceUid = randomBytes(16).toString('hex');

    this.prisma.device.create({
      data: {
        deviceName,
        deviceUid,
      },
    });
    return;
  }

  getAllDevices(): Promise<Device[]> {
    return this.prisma.device.findMany();
  }

  findByDeviceUid(deviceUid: string): Promise<Device> {
    return this.prisma.device.findUnique({ where: { deviceUid } });
  }

  findByDeviceName(deviceName: string): Promise<Device[]> {
    return this.prisma.device.findMany({ where: { deviceName } });
  }

  updateDevice(deviceUid: string, deviceName: string): Promise<void> {
    this.prisma.device.update({ where: { deviceUid }, data: { deviceName } });
    return;
  }

  deleteDevice(deviceUid: string): Promise<void> {
    this.prisma.device.delete({ where: { deviceUid } });
    return;
  }
}
