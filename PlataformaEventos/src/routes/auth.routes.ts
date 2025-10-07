import { Router } from "express";
import { register, login } from "../controllers/auth.controllers";
import { validateUser } from "../middlewares/validateUser"; 

const router = Router();

router.post("/register", validateUser, register);
router.post("/login", login);

export default router;