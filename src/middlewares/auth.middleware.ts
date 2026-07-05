import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../common/utils/ApiError.js';
import { HTTP } from '../common/constants/httpStatus.js';
import { Role } from '../common/constants/roles.js';

export interface AuthPayload {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const verifyToken = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(HTTP.UNAUTHORIZED, 'No token provided'));
  }
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    next();
  } catch {
    next(new ApiError(HTTP.UNAUTHORIZED, 'Invalid or expired token'));
  }
};
