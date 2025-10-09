import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    rol: string;
}

export const verifyToken = ( req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token no proporcionado o formato invalido"});
        }

        const token = header.split(" ")[1];
        const secret = process.env.JWT_SECRET! || "defaultSecret";
        if (!token) {
        throw new Error("JWT_SECRET no está definida en el archivo .env");
}
        const decoded = jwt.verify(token, secret) as unknown as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalido o expirado", error });
    }
};