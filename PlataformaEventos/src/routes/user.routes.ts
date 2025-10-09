import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middlewares";
import { isAdmin } from "../middlewares/roles";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, isAdmin, getUserById);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;