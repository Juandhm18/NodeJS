import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/roles";

const router = express.Router();

// Solo admin puede gestionar usuarios
router.get("/", requireAuth, requireRole("admin"), getUsers);
router.get("/:id", requireAuth, requireRole("admin"), getUserById);
router.put("/:id", requireAuth, requireRole("admin"), updateUser);
router.delete("/:id", requireAuth, requireRole("admin"), deleteUser);

export default router;