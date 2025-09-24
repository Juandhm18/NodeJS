import { Router } from "express";
import loans from "../data/loan.json";
import { validateLoan } from "../middlewares/validateDate";

const router = Router();

// Obtener todos los préstamos
router.get("/", (req, res) => {
  res.json(loans);
});

// Crear un préstamo nuevo
router.post("/", validateLoan, (req, res) => {
  const newLoan = { id: loans.length + 1, ...req.body };
  loans.push(newLoan);
  res.status(201).json(newLoan);
});

export default router;
