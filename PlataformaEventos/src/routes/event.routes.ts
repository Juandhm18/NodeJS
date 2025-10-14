import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getFutureEvents
} from "../controllers/event.controller";

import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/roles";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/futuros", getFutureEvents);
router.get("/:id", getEventById);

// Private routes (solo organizadores o admins)
router.post("/", requireAuth, requireRole("organizador", "admin"), createEvent);
router.put("/:id", requireAuth, requireRole("organizador", "admin"), updateEvent);
router.delete("/:id", requireAuth, requireRole("organizador", "admin"), deleteEvent);

export default router;
