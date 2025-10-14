import { Request, Response } from "express";
import { User } from "../models/user.models";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, rol } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashed = await hashPassword(password);

    const newUser = await User.create({ name, email, password: hashed, rol });

    // No exponer el password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token: string = generateToken({ id: user.id, rol: user.rol });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      message: "Login exitoso",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error exacto en login:", error);
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error instanceof Error ? error.message : error,
    });
  }
};
