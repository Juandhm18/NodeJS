import { Router } from "express";
import loans from "../data/loan.json";
import { validateLoan } from "../middlewares/validateDate";

const router = Router();

router.get("/", (req, res) => {
// Obtener todos los préstamos
  res.json(loans);
});

// Crear un préstamo nuevo
router.post("/", validateLoan, (req, res) => {
  const newLoan = { id: loans.length + 1, ...req.body };
  loans.push(newLoan);
  res.status(201).json(newLoan);
});

export default router;
