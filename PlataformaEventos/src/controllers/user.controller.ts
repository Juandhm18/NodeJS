import { Request, Response } from "express";
import { User } from "../models/user.models";

//Obtener todos los usuarios
export const getUsers = async ( req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Error al mostrar los usuarios", error})
    }
};
//obtner usuario by Id
export const getUserById = async ( req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if(!user) return res.status(404).json({ message: "Usuario no encontrado"})
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al encontrar al usuario", error})
    }
};

export const updateUser = async ( req: Request, res: Response) =>{
    try {
        const { id } = req.params;
        const [ updated ] = await User.update(req.body, { where: { id }});
        if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al editar al usuario", error})
    }
};

export const deleteUser = async ( req: Request, res: Response) =>{
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id }});
        if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar al usuario", error})
    }
};

