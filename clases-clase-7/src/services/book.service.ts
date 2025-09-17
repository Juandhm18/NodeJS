import { promises as fs } from "fs";
import type { IBook } from "../interfaces/book.interface.ts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, "../models/book.json");

export const getBooks = async (): Promise<IBook[]> => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        if (!data.trim()) return [];
        return JSON.parse(data) as IBook[];
    } catch (error: any) {

        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
};

export const getBook = async (id: string): Promise<IBook | null> => {
    const books = await getBooks();
    const book = books.find((book) => book.id === id);
    return book ?? null;
};

export const createBook = async (newBook: IBook): Promise<IBook> => {
    const books = await getBooks();
    books.push(newBook);
    await fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf-8");
    return newBook;
};

export const updateBook = async (
    id: string,
    updatedFields: Partial<IBook>
): Promise<IBook | undefined> => {
    const books = await getBooks();
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        return undefined;
    }


    books[index] = { ...books[index], ...updatedFields } as IBook;

    await fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf-8");

    return books[index];
};

export const deleteBook = async (id: string): Promise<boolean> => {
    const books = await getBooks();
    const filtered = books.filter((book) => book.id !== id);

    if (filtered.length === books.length) {
        return false;
    }

    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
};