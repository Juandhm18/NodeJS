import { Router } from "express";
import books from "../data/books.json";
import { auth } from "../middlewares/auth";
import { validateBook } from "../middlewares/validateBook";

const router = Router();

// GET → acceso libre
router.get("/", (req, res) => {
  res.json(books);
});

// POST → requiere auth + validación
router.post("/", auth, validateBook, (req, res) => {
  const newBook = { id: books.length + 1, ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT → requiere auth + validación
router.put("/:id", auth, validateBook, (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) return res.status(404).json({ error: "Book not found" });

  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

// DELETE → requiere auth
router.delete("/:id", auth, (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});

export default router;
