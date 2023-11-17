import { Controller, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeviceRepository } from '../repositories/prisma/DeviceRepository';
import jwt from 'jsonwebtoken';
import { Admin } from '@prisma/client';

interface IJWTDevice {
  deviceName: string;
  deviceUid: string;
  email: string;
  password: string;
}

function CheckJWTAdminPayload(x: unknown): x is Admin {
  return (
    (x as Admin).id !== undefined &&
    (x as Admin).email !== undefined &&
    (x as Admin).password !== undefined &&
    (x as Admin).name !== undefined
  );
}

function CheckJWTDevicePayload(x: unknown): x is IJWTDevice {
  return (
    (x as IJWTDevice).deviceUid !== undefined &&
    (x as IJWTDevice).email !== undefined &&
    (x as IJWTDevice).password !== undefined &&
    (x as IJWTDevice).deviceName !== undefined
  );
}

@Controller('api/auth')
export class AuthController {
  constructor(private deviceRepository: DeviceRepository) {}

  // FOR ADMIN ESP32
  @Post('refresh-token/device')
  async refreshToken(
    @Headers('Authorization') header: string,
    @Res() res: Response,
  ): Promise<Response> {
    const refreshToken = header.split(' ')[1];
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      );
      if (!CheckJWTDevicePayload(decoded)) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      const device = await this.deviceRepository.findByDeviceUid(
        decoded.deviceUid,
      );
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      const newAccessToken = jwt.sign(device, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '1h',
      });
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  // FOR ADMIN WEBSITE
  @Post('refreshToken/admin')
  async postRefreshToken(
    @Headers('Authorization') header: string,
    @Res() res: Response,
  ): Promise<Response> {
    const refreshToken = header.split(' ')[1];
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      );
      if (!decoded) return res.status(401).json({ message: 'Invalid token' });
      if (!CheckJWTAdminPayload(decoded))
        return res.status(401).json({ message: 'Invalid payload' });
      const newAccessToken = jwt.sign(
        decoded,
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: '1h' },
      );
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
}
