import { Body, Controller, Post } from '@nestjs/common';
import { Login } from 'src/common/dtos/login';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config({ path: './../../.env' });

export const users = [
  {
    id: 1,
    username: 'teste',
    email: 'teste@gmail.com',
    password: '1234',
  },
  {
    id: 2,
    username: 'teste2',
    email: 'teste2@gmail.com',
    password: '1234',
  },
  {
    id: 3,
    username: 'teste3',
    email: 'teste3@gmail.com',
    password: '1234',
  },
];

@Controller('auth')
export class AuthController {
  @Post('login')
  async postLogin(@Body() body: Login): Promise<object> {
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

    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN);

    return {
      status: 200,
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }
}
