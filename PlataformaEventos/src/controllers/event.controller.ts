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
}