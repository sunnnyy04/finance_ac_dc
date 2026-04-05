import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: Error | ApiError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message: string | object = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors || JSON.parse(err.message);
  } else {
    console.error(err);
    message = err.message || "Internal Server Error";
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
