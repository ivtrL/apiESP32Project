/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from 'src/base/repositories/prisma/UserRepository';

@Injectable()
export class verifyAccessJWTMiddleware implements NestMiddleware {
  constructor(private UserRepository: UserRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const userdb = await this.UserRepository.findByEmail(email);
    if (!userdb) {
      return res.status(404).json({ message: 'User not found' });
    } else if (userdb[0].password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
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
