import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err.message);

  res.status(err.statusCode ?? 500).json({
    success: false,
    message: err.message ?? "Internal Server Error"
  });
};
