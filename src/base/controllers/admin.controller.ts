/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { AdminRepository } from '../repositories/prisma/AdminRepository';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Login } from 'src/common/dtos/Login';

@Controller('admin')
export class AdminController {
  constructor(private AdminRepository: AdminRepository) {}

  @Post('refresh-token')
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
      const admin = await this.AdminRepository.findByEmail(decoded['email']);
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      const accessToken = jwt.sign(decoded, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '1h',
      });
      return res.status(201).json({ accessToken });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token provided' });
    }
  }

  @Post('login')
  async postLoginAdmin(
    @Body() body: Login,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password } = body;
    const admin = this.AdminRepository.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    } else if (admin[0].password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const accessToken = jwt.sign(admin, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(admin, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: '3d',
    });

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  }
}
