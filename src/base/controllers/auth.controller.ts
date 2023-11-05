/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Login } from 'src/common/dtos/Login';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserRepository } from '../repositories/prisma/UserRepository';

dotenv.config({ path: './../../.env' });

@Controller('auth')
export class AuthController {
  constructor(private UserRepository: UserRepository) {}

  @Post('login')
  async postLogin(
    @Body() body: Login,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password } = body;
    const user = await this.UserRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else if (user[0].password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN);

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  }
}
