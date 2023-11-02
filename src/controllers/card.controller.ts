import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckCardDto } from 'src/dtos/check-card';
import { users } from './auth.controller';
import { Login } from 'src/dtos/login';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// dotenv.config({ path: '../../.env' });

export const cards = [
  { cardUid: '', personName: '' },
  { cardUid: '', personName: '' },
  { cardUid: '', personName: '' },
];

@Controller('api')
export class CardController {
  @Get()
  getHello(): string {
    return 'Hello World from get!';
  }

  @Post()
  postHello(): string {
    return 'Hello World from post!';
  }

  @Post('check-card')
  async postCheckCard(@Body() body: CheckCardDto): Promise<object> {
    const { cardUid } = body;
    const card = await cards.find((card) => card.cardUid === cardUid);

    if (!card) {
      return {
        status: 404,
        message: 'Card not found',
      };
    }
    return {
      status: 200,
      message: 'Authorized',
    };
  }
  @Post('refresh-token')
  async postRefreshToken(@Body() body: Login): Promise<object> {
    const { email, password } = body;
    const user = await users.find((user) => user.email === email);

    if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (user.password !== password) {
      return {
        status: 401,
        message: 'Invalid password',
      };
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: '1h',
    });

    return {
      status: 200,
      message: 'Login successful',
      accessToken,
    };
  }
}
