import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { users } from 'src/controllers/auth.controller';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// dotenv.config({ path: '../../.env' });

@Injectable()
export class verifyRefreshJWTMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const userdb = users.find(
      (user) => user.email === email && user.password === password,
    );
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      } else if (user != userdb) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      req.body.user = user;
    });
    next();
  }
}
