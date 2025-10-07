import { Request, Response } from "express";
import { User } from "../models/user.models";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export const register = async ( req: Request, res: Response) => {
    try {
        const { name, email, password, rol} = req.body;
        const userExists = await User.findOne({ where: { email }});
        if (userExists) return res.status(400).json({ message: "El email ya existe"})
        
        const hashed = await hashPassword(password);
        const newUser = await User.create({ name, email, password: hashed, rol})

        res.status(201).json({ message: "Usuario creado", user: newUser})
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error})
    }
}

export const login = async ( req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({where: { email }});
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

        const valid = await comparePassword(password, user.password);
        if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" })

        const token = generateToken({ id: user.id, rol: user.rol })

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar usuario", error})
    }
}