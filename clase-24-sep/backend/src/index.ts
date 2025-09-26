import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger";
import booksRouter from "./routes/books";

const app = express();

// Configuración CORS (solo frontend en 5173)
app.use(cors({
  origin: "http://localhost:5173"
}));

// Middlewares globales
app.use(express.json());
app.use(logger);

// Rutas
app.use("/books", booksRouter);

// Servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
