import jwt, { SignOptions, JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

if (!JWT_SECRET) {
  throw new Error("Falta la variable JWT_SECRET en el archivo .env");
}

// Definimos un tipo para los datos del token
export interface JwtPayload extends DefaultJwtPayload {
  id: number;
  rol: string;
}

// Generar un token firmado
export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

// Verificar y decodificar token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    console.error("Error verificando JWT:", error.message);
    return null;
  }
};
