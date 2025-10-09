import express from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, getFutureEvents } from "../controllers/event.controller";
import { verifyToken } from "../middlewares/auth.middlewares";

const router = express.Router();

//public
router.get("/", getEvents);
router.get("/futuros", getFutureEvents);
router.get("/:id", getEventById);

//private
router.post("/", verifyToken, createEvent);
router.put("/:id", verifyToken, updateEvent);
router.delete("/:id", verifyToken, deleteEvent);

export default router;