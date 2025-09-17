import { promises as fs } from "fs"
import type { IUser } from "../interfaces/user.interface.ts"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { randomUUID } from "crypto"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const file_Path = join(__dirname, "../models/users-large.json")

// Obtener todos los usuarios
export const getUsers = async (): Promise<IUser[]> => {
    try {
        const data = await fs.readFile(file_Path, "utf-8")
        if (!data.trim()) return []

        // El archivo es un array JSON válido
        const users = JSON.parse(data)

        // Mapear solo los campos que necesitas
        return users.map((user: any) => ({
            id: user.id.toString(),
            name: user.name,
            role: user.role
        }))
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return []
        }
        throw error
    }
}

// Obtener un usuario por id
export const getUser = async (id: string): Promise<IUser | null> => {
    const users = await getUsers()
    return users.find((user) => user.id === id) ?? null
}

// Crear un usuario (genera id automáticamente)
export const createUser = async (
    newUser: Omit<IUser, "id">
): Promise<IUser> => {
    const users = await getUsers()
    const userWithId: IUser = { id: randomUUID(), ...newUser }
    users.push(userWithId)
    await fs.writeFile(file_Path, JSON.stringify(users, null, 2), "utf-8")
    return userWithId
}

// Actualizar un usuario
export const updateUser = async (
    id: string,
    updatedFields: Partial<IUser>
): Promise<IUser | undefined> => {
    const users = await getUsers()
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) return undefined

    users[index] = { ...users[index], ...updatedFields } as IUser

    await fs.writeFile(file_Path, JSON.stringify(users, null, 2), "utf-8")
    return users[index]
}

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<boolean> => {
    const users = await getUsers()
    const filtered = users.filter((user) => user.id !== id)

    if (filtered.length === users.length) return false

    await fs.writeFile(file_Path, JSON.stringify(filtered, null, 2), "utf-8")
    return true
}