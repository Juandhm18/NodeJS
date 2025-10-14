import { Request, Response } from "express";
import { Event } from "../models/event.model";
import { Op } from "sequelize";
import { logAction } from "../utils/logAction";

// Buscar eventos (por lugar o nombre)
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { place, name } = req.query;
    const where: any = {};

    if (place) where.place = { [Op.iLike]: `%${place}%` };
    if (name) where.title = { [Op.iLike]: `%${name}%` };

    const eventos = await Event.findAll({ where });
    res.json({ message: "Eventos obtenidos", eventos });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los eventos",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Obtener evento por ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await Event.findByPk(id);

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json({ message: "Evento encontrado", evento });
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar evento",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Obtener solo eventos futuros
export const getFutureEvents = async (req: Request, res: Response) => {
  try {
    const eventos = await Event.findAll({
      where: {
        date: { [Op.gt]: new Date() },
      },
    });

    res.json({ message: "Eventos futuros obtenidos", eventos });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener eventos futuros",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Crear evento
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, place, capacity } = req.body;
    const organizerId = (req as any).user?.id || null;

    const evento = await Event.create({
      title,
      description,
      date,
      place,
      capacity,
      organizerId,
    });

    if (organizerId) {
      await logAction("creó un evento", organizerId, `Evento ID: ${evento.id}`);
    }

    res.status(201).json({ message: "Evento creado correctamente", evento });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear evento",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Actualizar evento
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await Event.findByPk(id);

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    await evento.update(req.body);

    const organizerId = (req as any).user?.id;
    if (organizerId) {
      await logAction("actualizó un evento", organizerId, `Evento ID: ${id}`);
    }

    res.json({ message: "Evento actualizado correctamente", evento });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar evento",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Eliminar evento
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await Event.findByPk(id);

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    await evento.destroy();

    const organizerId = (req as any).user?.id;
    if (organizerId) {
      await logAction("eliminó un evento", organizerId, `Evento ID: ${id}`);
    }

    res.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar evento",
      error: error instanceof Error ? error.message : error,
    });
  }
};
