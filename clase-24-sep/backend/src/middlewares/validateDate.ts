import { z } from "zod";
import { type Request, type Response, type NextFunction } from "express";

const loanSchema = z.object({
  userEmail: z.string().email(),
  bookTitle: z.string().min(1),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Formato de fecha inválido",
  }),
});

export function validateLoan(req: Request, res: Response, next: NextFunction) {
  try {
    loanSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.errors });
  }
}
