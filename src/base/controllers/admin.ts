import { Body, Controller, Post, Res, Put, Param } from '@nestjs/common';
import { AdminRepository } from '../repositories/prisma/AdminRepository';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Login } from 'src/common/dtos/Login';

@Controller('api/admin')
export class AdminController {
  constructor(private adminRepository: AdminRepository) {}

  @Post('login')
  async postLoginAdmin(
    @Body() body: Login,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password } = body;
    const admin = this.adminRepository.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    } else if (admin[0].password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const accessToken = jwt.sign(admin, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(admin, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: '1d',
    });

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  }

  @Put('update/:id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() body: { email?: string; password?: string; name?: string },
    @Res() res: Response,
  ): Promise<Response> {
    await this.adminRepository.updateAdmin(id, body);
    const admin = await this.adminRepository.findById(id);

    return res.status(200).json({ message: 'Admin updated', admin });
  }
}
