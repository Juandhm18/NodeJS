import type { NextFunction, Request, Response } from "express";

export function validateUserData(req: Request, res: Response, next: NextFunction) {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Body type:", typeof req.body);
  
  // Verificar que req.body existe
  if (!req.body) {
    return res.status(400).json({
      error: "Request body is missing. Make sure to send JSON data with Content-Type: application/json",
    });
  }

  const { name, role } = req.body;
  
  if (typeof name !== "string" || typeof role !== "string") {
    return res.status(400).json({
      error: "Invalid data: 'name' and 'role' must be strings",
      received: { name: typeof name, role: typeof role }
    });
  }
  
  // Si pasa la validación, continuar
  next();
}

export function checkPermissions(req: Request, res: Response, next: NextFunction) {
  const { role } = req.body;

  if (role !== "admin") {
    return res.status(403).json({
      error: "Forbidden: only admin users can create new users",
    });
  }
  console.log("Pásale nomás wey")

  // Si tiene permisos, continuar
  next();
}