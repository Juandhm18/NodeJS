import { Request, Response, NextFunction } from "express";

const VALID_TOKEN = "12345";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== VALID_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  next();
}
