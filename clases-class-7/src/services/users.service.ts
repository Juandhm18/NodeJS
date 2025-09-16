import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { IUser } from "../interfaces/book.interface.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, "users.json");

async function ensureFile() {
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, "[]", "utf-8");
  }
}

export const getAllUsers = async (): Promise<IUser[]> => {
  const data = await fs.readFile(FILE_PATH, "utf-8")
  console.log('filePath', FILE_PATH)
  return JSON.parse(data) as IUser[]
}

export async function addUser(user: IUser): Promise<IUser> {
  await ensureFile();
  const users = await getAllUsers();
  users.push(user);
  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
  return user;
}

export async function getUserById(id: string): Promise<IUser | null> {
  const users = await getAllUsers();
  return users.find(user => user.id === id) || null;
}