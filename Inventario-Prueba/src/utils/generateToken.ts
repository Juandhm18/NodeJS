import jwt from "jsonwebtoken";

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en el archivo .env");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(payload, secret as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
};