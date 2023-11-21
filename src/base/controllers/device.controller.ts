import * as jwt from 'jsonwebtoken';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { DeviceNameDto } from 'src/common/dtos/DeviceName';
import { Response } from 'express';
import {
  AbstractAdminRepository,
  AbstractDeviceRepository,
} from '../repositories';

@Controller('api/device')
export class DeviceController {
  constructor(
    private deviceRepository: AbstractDeviceRepository,
    private adminRepository: AbstractAdminRepository,
  ) {}

  // FOR ADMIN WEBSITE
  @Post('create')
  async createDevice(
    @Body() body: DeviceNameDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { deviceName } = body;
    await this.deviceRepository.createDevice(deviceName);
    const deviceList = await this.deviceRepository.getAllDevices();
    return res.status(201).json({ deviceList });
  }

  @Get()
  async getDevices(
    @Res() res: Response,
    @Query('deviceName') deviceName?: string,
    @Query('deviceUid') deviceUid?: string,
  ): Promise<Response> {
    if (deviceName) {
      const deviceList =
        await this.deviceRepository.findByDeviceName(deviceName);
      return res.status(200).json({ deviceList });
    } else if (deviceUid) {
      const deviceList = await this.deviceRepository.findByDeviceUid(deviceUid);
      return res.status(200).json({ deviceList });
    } else {
      const deviceList = await this.deviceRepository.getAllDevices();
      return res.status(200).json({ deviceList });
    }
  }

  @Put('update/:id')
  async updateDevice(
    @Param('id') id: string,
    @Body() body: DeviceNameDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.deviceRepository.updateDevice(id, body.deviceName);
    const deviceList = await this.deviceRepository.getAllDevices();
    return res.status(200).json({ deviceList });
  }

  @Delete('delete/:id')
  async deleteDevice(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.deviceRepository.deleteDevice(id);
    const deviceList = await this.deviceRepository.getAllDevices();
    return res.status(200).json({ deviceList });
  }

  // FOR ESP32

  @Post('login')
  async loginDevice(
    @Body()
    body: {
      deviceName: string;
      deviceUid: string;
      email: string;
      password: string;
    },
    @Res() res: Response,
  ): Promise<Response> {
    console.log(body);
    const { deviceName, deviceUid, email, password } = body;

    const device = await this.deviceRepository.findByDeviceUid(deviceUid);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    } else if (device.deviceName !== deviceName) {
      return res.status(401).json({ message: 'Invalid device name' });
    }

    const user = await this.adminRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = jwt.sign(
      { deviceName, deviceUid, email, password },
      process.env.ACCESS_SECRET_TOKEN,
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = jwt.sign(
      { deviceName, deviceUid, email, password },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: '1d' },
    );

    return res.status(201).json({ accessToken, refreshToken });
  }
}
