import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}
