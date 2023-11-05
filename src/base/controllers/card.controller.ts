/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { CheckCardDto } from 'src/common/dtos/check-card';
import { User } from '@prisma/client';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { LogRepository } from '../repositories/prisma/LogRepository';
import { DeviceRepository } from '../repositories/prisma/DeviceRepository';
import { TimeRepository } from '../repositories/prisma/TimeRepository';
import { CardRepository } from '../repositories/prisma/CardRepository';
import { CreateUserDto } from 'src/common/dtos/CreateUser';
import { Login } from 'src/common/dtos/Login';

@Controller('api')
export class CardController {
  constructor(
    private UserRepository: UserRepository,
    private LogRepository: LogRepository,
    private DeviceRepository: DeviceRepository,
    private TimeRepository: TimeRepository,
    private CardRepository: CardRepository,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World from get!';
  }

  @Post()
  postHello(): string {
    return 'Hello World from post!';
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.UserRepository.getAllUsers();
  }

  @Post('delete-user')
  async deleteUser(
    @Body() userData: { userId: string },
    @Res() res: Response,
  ): Promise<Response> {
    const { userId } = userData;
    await this.UserRepository.deleteUser(userId);
    return res.status(200).send();
  }

  @Post('user')
  async postUser(
    @Body() userData: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name } = userData;
    await this.UserRepository.createUser(email, password, name);
    return res.status(201).send();
  }

  @Post('check-card')
  async postCheckCard(
    @Body() body: CheckCardDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { cardUid } = body;
    const card = await this.CardRepository.findByCardUid(cardUid);
    if (!card) {
      return res.status(404).send();
    }
    return res.status(200).send();
  }

  @Post('refresh-token')
  postRefreshToken(@Body() body: Login, @Res() res: Response): Response {
    const { email, password } = body;
    const token = jwt.sign(
      { email, password },
      process.env.ACCESS_SECRET_TOKEN,
    );
    return res.status(201).json({
      token,
    });
  }
}
