import {NextFunction, Request, Response} from 'express';
import {insertUser} from '../db/services/users';

export const userLogger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await insertUser({ IP: req.ip, timestamp: new Date(Date.now()) });
  next();
};
