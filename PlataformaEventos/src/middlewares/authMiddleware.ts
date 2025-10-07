import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    // Recibe el header
    const authHeader = req.headers.authorization;
    //Comprueba que tenga el formato "Bearer token"
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "Token no proporcionado"})
    }
    //Aqui se extrae todo el token que viene despues del Bearer
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token mal formado" });
    }
    //Se comprueba si es valido
    const decoded = verifyToken(token);

    if (!decoded){
        return res.status(401).json({ message: "Token invalido"})
    }
    //Una vez valido, agrega el usuario al request y continua
    (req as any).user = decoded;

    next();
}