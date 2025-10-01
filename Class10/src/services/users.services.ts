import { type IUser } from "../interfaces/users.interface.ts";
import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "../models/users.json");

const getUsersService = async (): Promise<IUser[]> => {
    const users = await fs.readFile(filepath, "utf-8");
    return JSON.parse(users) as IUser[];
};

const getUsersByIDService = async (id: number): Promise<IUser | null> => {
    const users = await getUsersService();
    const user = users.find(u => u.id === id);
    return user || null;
};

const postUsersService = async (newUser: IUser): Promise<IUser> => {
    const users = await getUsersService();
    users.push(newUser);
    await fs.writeFile(filepath, JSON.stringify(users, null, 4), "utf-8");
    return newUser;
};

const putUsersService = async (id: number, updatedUser: Partial<IUser>): Promise<IUser | null> => {
    const users = await getUsersService();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return null;
    }
    users[index] = { ...users[index], ...updatedUser, id } as IUser;
    await fs.writeFile(filepath, JSON.stringify(users, null, 4), "utf-8");
    return users[index];
};

const deleteUsersService = async (id: number): Promise<boolean> => {
    const users = await getUsersService();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return false;
    }
    users.splice(index, 1);
    await fs.writeFile(filepath, JSON.stringify(users, null, 4), "utf-8");
    return true;
};

export { getUsersService, getUsersByIDService, postUsersService, putUsersService, deleteUsersService };