import { Request, Response } from "express";
import { Inscription } from "../models/inscription.model";

export const createInscription = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;
    const userId = (req as any).user.id;

    const existing = await Inscription.findOne({ where: { userId, eventId } });
    if (existing)
      return res.status(400).json({ message: "Ya estás inscrito en este evento" });

    const inscription = await Inscription.create({
      userId,
      eventId,
      status: "pendiente",
    });

    res.status(201).json({ message: "Inscripción creada", inscription });
  } catch (error) {
    res.status(500).json({ message: "Error al inscribirse", error });
  }
};

// Listar inscripciones del usuario autenticado
export const getMyInscriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const inscriptions = await Inscription.findAll({ where: { userId } });
    res.json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener inscripciones", error });
  }
};