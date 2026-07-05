import { Request, Response } from 'express';
import { HTTP } from '../common/constants/httpStatus.js';

export const notFound = (_req: Request, res: Response): void => {
  res.status(HTTP.NOT_FOUND).json({ success: false, message: 'Route not found' });
};
