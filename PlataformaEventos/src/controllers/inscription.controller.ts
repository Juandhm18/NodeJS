import { Request, Response } from "express";
import { Inscription } from "../models/inscription.model";
import { Event } from "../models/event.model";
import { logAction } from "../utils/logAction";

// Crear inscripción
export const createInscription = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;
    const userId = (req as any).user.id;

    // Validar que el evento exista
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "El evento no existe" });
    }

    // Verificar si el usuario ya está inscrito
    const existing = await Inscription.findOne({ where: { userId, eventId } });
    if (existing) {
      return res.status(400).json({ message: "Ya estás inscrito en este evento" });
    }

    // Crear inscripción
    const inscription = await Inscription.create({
      userId,
      eventId,
      estado: "pendiente",
    });

    await logAction("se inscribió a un evento", userId, `Evento ID: ${eventId}`);

    res.status(201).json({ message: "Inscripción creada correctamente", inscription });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear inscripción",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Listar inscripciones del usuario autenticado
export const getMyInscriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const inscriptions = await Inscription.findAll({
      where: { userId },
      include: [{ model: Event }],
    });

    res.json({ message: "Inscripciones obtenidas", inscriptions });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener inscripciones",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Actualizar estado de inscripción (por admin u organizador)
export const updateInscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const userId = (req as any).user?.id;

    const inscription = await Inscription.findByPk(id);
    if (!inscription) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    inscription.estado = estado;
    await inscription.save();

    if (userId) {
      await logAction("actualizó una inscripción", userId, `Inscripción ID: ${id}`);
    }

    res.json({ message: "Estado de inscripción actualizado", inscription });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar inscripción",
      error: error instanceof Error ? error.message : error,
    });
  }
};
