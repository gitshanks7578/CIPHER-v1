import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";

export const errorHandler = (err: unknown,req: Request,res: Response,next: NextFunction) => {
  console.error("API Error:", err);

  if (err instanceof apiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for unknown errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};