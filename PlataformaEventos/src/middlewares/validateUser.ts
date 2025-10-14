import { z, ZodError, ZodIssue } from "zod";
import { Request, Response, NextFunction } from "express";

// Esquemas
const userRegisterSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const userLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Middleware genérico
export const validateUser = (schema: "register" | "login") => {
  // 🔹 dejar que TS infiera el tipo
  const validator = schema === "register" ? userRegisterSchema : userLoginSchema;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      validator.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          message: "Error de validación",
          errors: issues,
        });
      }
      next(error);
    }
  };
};
