import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "2h"});
}

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);      
    } catch (error) {
        return null;
    }
};