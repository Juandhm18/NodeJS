import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/roles.middleware";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.controller";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("admin"), createProduct);
router.get("/", getProducts);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateProduct);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteProduct);

export default router;