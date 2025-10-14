import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    rol: string;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado o inválido" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token mal formado" });
    }
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    req.user = {
      id: decoded.id,
      rol: decoded.rol,
    };

    next();
  } catch (error: any) {
    console.error("Error verificando token:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
