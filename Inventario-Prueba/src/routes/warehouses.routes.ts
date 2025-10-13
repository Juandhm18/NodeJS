import { Router } from "express";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from "../controllers/warehouse.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getWarehouses);
router.post("/", authenticateToken, createWarehouse);
router.put("/:id", authenticateToken, updateWarehouse);
router.delete("/:id", authenticateToken, deleteWarehouse);

export default router;