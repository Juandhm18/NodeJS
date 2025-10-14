import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user){
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        if (!allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
            return res.status(403).json({ message: "Acceso denegado" });
}

        next();
    };
};