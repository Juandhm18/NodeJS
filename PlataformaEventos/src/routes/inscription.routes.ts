import { Router } from "express";
import { 
  createInscription, 
  getMyInscriptions, 
  updateInscription 
} from "../controllers/inscription.controller";

import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Crear inscripción (usuario autenticado)
router.post("/", requireAuth, createInscription);

// Listar inscripciones propias
router.get("/mine", requireAuth, getMyInscriptions);

// Actualizar inscripción (podría ser extendido para controlar propietario)
router.put("/:id", requireAuth, updateInscription);

export default router;
