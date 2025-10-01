/*import { promises as fs } from "fs";
import { type IBook } from "../interfaces/books.interface.ts";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { get } from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "../models/books.json");

const getBooksService = async (): Promise<IBook[]> => {
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data) as IBook[];
};

const getBooksByIDService = async (id:number): Promise<IBook | null> => {
    const books = await getBooksService();
    const book = books.find(b => b.id === id) || null;
    return book;
};

const postBooksService = async (newBook: IBook): Promise<IBook> => {
    const books = await getBooksService();
    books.push(newBook);
    await fs.writeFile(filepath, JSON.stringify(books, null, 4), "utf-8");
    return newBook;
};

const putBooksService = async (id:number, updatedBook: Partial<IBook>): Promise<IBook | null> => {
    const books = await getBooksService();
    const index = books.findIndex(b => b.id === id);
    if ( index === -1 ) {
        return null;
    }
    books[index] = { ...books[index], ...updatedBook, id} as IBook;
    await fs.writeFile(filepath, JSON.stringify(books, null, 4), "utf-8");
    return books[index];
};

const deleteBooksService = async (id:number): Promise<boolean> => {
    const books = await getBooksService();
    const index = books.findIndex(b => b.id === id);
    if ( index === -1 ) {
        return false;
    }
    books.splice(index, 1);
    await fs.writeFile(filepath, JSON.stringify(books, null, 4), "utf-8");
    return true;
};

export { getBooksService, getBooksByIDService, postBooksService, putBooksService, deleteBooksService };*/

import { Book } from "../models/index.models.js";
import type { BookCreation } from "../models/books.models.ts";

const getBooksService = async () => {
  return Book.findAll();
};

const getBooksByIDService = async (id: number) => {
  return Book.findByPk(id);
};

const postBooksService = async (newBook: BookCreation) => {
  return Book.create(newBook);
};

const putBooksService = async (id: number, updatedBook: Partial<BookCreation>) => {
  const book = await Book.findByPk(id);
  if (!book) return null;
  return book.update(updatedBook);
};

const deleteBooksService = async (id: number) => {
  const deleted = await Book.destroy({ where: { id } });
  return deleted > 0;
};

export { getBooksService, getBooksByIDService, postBooksService, putBooksService, deleteBooksService };