import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { object, string, number } from 'yup';

const DeviceSchema = object({
  email: string().email().required(),
  password: string().required(),
  deviceName: string().required(),
  deviceUid: string().required(),
});

const AdminSchema = object({
  email: string().email().required(),
  password: string().required(),
  name: string().required(),
  id: number().required(),
});

@Injectable()
export class VerifyJwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (
        !DeviceSchema.isValidSync(decoded) &&
        !AdminSchema.isValidSync(decoded)
      )
        return res.status(401).json({ message: 'Invalid token' });
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
