import { Request, Response, NextFunction } from "express";
import { ApiError } from "../common/utils/ApiError.js";
import { env } from "../config/env.js";
import { HTTP } from "../common/constants/httpStatus.js";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Malformed JSON body (thrown by express.json() parser)
  if ((err as any).type === 'entity.parse.failed') {
    res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: 'Malformed JSON in request body',
      errors: [],
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? [],
    });
    return;
  }

  // Raw ZodError safety net (should normally be caught by validate middleware)
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: (e.path as (string | number)[]).join('.'),
      message: e.message,
    }));
    res.status(HTTP.BAD_REQUEST).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? "field";
    res.status(HTTP.CONFLICT).json({
      success: false,
      message: `Duplicate value for ${field}`,
      errors: [{ field, message: `${field} already exists` }],
    });
    return;
  }

  if (env.NODE_ENV !== "production") console.error(err);

  res.status(HTTP.INTERNAL).json({
    success: false,
    message: "Internal server error",
    errors: [],
  });
};
