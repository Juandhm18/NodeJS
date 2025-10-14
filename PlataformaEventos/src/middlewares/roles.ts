import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    rol: string;
  };
}

// Middleware genérico para roles
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.rol)) {
      return res.status(403).json({
        message: `Acceso denegado: Se requiere uno de estos roles: ${roles.join(", ")}`
      });
    }

    next();
  };
};

// Ejemplo: middleware específico para admin
export const isAdmin = requireRole("admin");
