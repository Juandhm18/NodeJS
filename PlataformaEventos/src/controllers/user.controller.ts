import { Request, Response } from "express";
import { User } from "../models/user.models";
import { hashPassword } from "../utils/password";

// Obtener todos los usuarios (solo admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Evita exponer contraseñas
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la lista de usuarios",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, rol } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si viene password, lo hasheamos antes de guardar
    if (password) {
      user.password = await hashPassword(password);
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (rol) user.rol = rol;

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      message: "Usuario actualizado correctamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

