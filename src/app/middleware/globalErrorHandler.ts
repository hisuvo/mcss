/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Somethis is Wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default globalErrorHandler;
