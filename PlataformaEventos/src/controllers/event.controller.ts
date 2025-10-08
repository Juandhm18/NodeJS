import { Request, Response } from "express";
import { Event } from "../models/event.model";
import { Op } from "sequelize";

//busca por ubicacion o nombre
export const getEvents = async (req: Request, res: Response) => {
    const { place, name } = req.query;
    const where: any = {};

    if (place){
        where.place = {[Op.like]: `%${place}%`};
    }

    if (name){
        where.title = {[Op.like]: `%${name}%`};
    }

    const eventos = await Event.findAll({ where });
    res.json(eventos);
};

//Eventos futuros
export const getFutureEvents = async (req: Request, res: Response) => {
    const eventos = await Event.findAll({
        where:{
            date: { [Op.gt]: new Date() },
        },
    });
    res.json(eventos);
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, place, capacity } = req.body;
    const organizerId = (req as any).user?.id; // esto vendrá del token

    const evento = await Event.create({
      title,
      description,
      date,
      place,
      capacity,
      organizerId,
    });

    res.status(201).json({ message: "Evento creado", evento });
  } catch (error) {
    res.status(500).json({ message: "Error al crear evento", error });
  }
};

// Actualizar evento
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Event.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ message: "Evento actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar evento", error });
  }
};

// Eliminar evento
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Event.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar evento", error });
  }
};