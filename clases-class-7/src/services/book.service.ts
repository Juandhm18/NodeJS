import { promises as fs } from "fs"
import type { IBook } from "../interfaces/book.interface.ts"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePath = join(__dirname, "../models/book.json")


export const getBooks = async (): Promise<IBook[]> => {
  const data = await fs.readFile(filePath, "utf-8")
  return JSON.parse(data) as IBook[]
}

export const getBookById = async (id: string): Promise<IBook | null> => {
  const books = await getBooks()
  return books.find((book) => book.id === id) || null
}

export const addBook = async (newBook: IBook): Promise<void> => {
  const books = await getBooks()
  books.push(newBook)
  await fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf-8")
}

export const deleteBook = async (id: string): Promise<boolean> => {
  const books = await getBooks()
  const filtered = books.filter((book) => book.id !== id)

  if (filtered.length === books.length) {
    return false
  }

  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8")
  return true
}
