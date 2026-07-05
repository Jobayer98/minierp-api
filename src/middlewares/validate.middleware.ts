import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { HTTP } from "../common/constants/httpStatus.js";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    console.log("===============>>>>>", req.body);
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: (e.path as (string | number)[]).join("."),
        message: e.message,
      }));
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, message: "Validation failed", errors });
      return;
    }
    req.body = result.data;
    next();
  };
