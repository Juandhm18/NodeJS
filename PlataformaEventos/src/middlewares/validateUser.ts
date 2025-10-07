import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Esquema para registro
const userRegisterSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Esquema para login
const userLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Middleware genérico para validación
export const validateUser =
  (schema: "register" | "login") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = schema === "register" ? userRegisterSchema : userLoginSchema;
      validator.parse(req.body); // valida los datos
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors,
      });
    }
  };