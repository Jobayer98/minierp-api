import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/utils/ApiError.js';
import { HTTP } from '../common/constants/httpStatus.js';
import { Role } from '../common/constants/roles.js';

export const requireRole =
  (roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(HTTP.FORBIDDEN, 'Insufficient permissions'));
    }
    next();
  };
