import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { users } from 'src/controllers/auth.controller';
import dotenv from 'dotenv';

// dotenv.config({ path: '../../.env' });

@Injectable()
export class verifyAccessJWTMiddleware implements NestMiddleware {
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
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid access token' });
      } else if (user != userdb) {
        return res.status(403).json({ message: 'Invalid access token' });
      }
      req.body.user = user;
    });
    next();
  }
}
