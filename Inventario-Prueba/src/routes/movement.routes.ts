import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/roles.middleware";
import { createMovement, getMovements } from "../controllers/movement.controller";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("admin", "analyst"), createMovement);
router.get("/", authenticateToken, authorizeRoles("admin", "analyst"), getMovements);

export default router;
