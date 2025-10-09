import { Router } from "express";
import { 
    createInscription, 
    getMyInscriptions, 
    updateInscription 
} from "../controllers/inscription.controller";
import { verifyToken } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", verifyToken, createInscription);
router.get("/mine", verifyToken, getMyInscriptions);
router.put("/:id", verifyToken, updateInscription);

export default router;