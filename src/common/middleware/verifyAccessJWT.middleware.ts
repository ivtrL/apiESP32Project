import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function CheckJwtPayload<T = undefined>(x: unknown): x is T {
  if () return false;
  const arr = Object.keys(x);
}

@Injectable()
export class VerifyJwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
