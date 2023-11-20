import { Controller, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { object, string, number } from 'yup';
import { AbstractDeviceRepository } from '../repositories';

const DeviceSchema = object({
  deviceName: string().required(),
  deviceUid: string().required(),
  email: string().email().required(),
  password: string().required(),
});

const AdminSchema = object({
  id: number().required(),
  AdminId: string().required(),
  name: string().notRequired(),
  email: string().email().required(),
  password: string().required(),
});

@Controller('api/auth')
export class AuthController {
  constructor(private deviceRepository: AbstractDeviceRepository) {}

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
      console.log(decoded);
      if (!DeviceSchema.isValidSync(decoded))
        return res.status(401).json({ message: 'Invalid refresh token' });
      const device = await this.deviceRepository.findByDeviceUid(
        decoded.deviceUid,
      );
      if (!device) return res.status(404).json({ message: 'Device not found' });
      const newAccessToken = jwt.sign(
        decoded,
        process.env.ACCESS_SECRET_TOKEN,
        {
          expiresIn: '1h',
        },
      );
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Error' });
    }
  }

  // FOR ADMIN WEBSITE
  @Post('refresh-token/admin')
  async postRefreshToken(
    @Headers('Authorization') header: string,
    @Res() res: Response,
  ): Promise<Response> {
    const refreshToken = header.split(' ')[1];
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token provided' });
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      );
      if (!decoded) return res.status(401).json({ message: 'Invalid token' });
      if (!AdminSchema.isValidSync(decoded))
        return res.status(401).json({ message: 'Invalid payload' });
      const newAccessToken = jwt.sign(
        decoded,
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: '1h' },
      );
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Error' });
    }
  }
}
