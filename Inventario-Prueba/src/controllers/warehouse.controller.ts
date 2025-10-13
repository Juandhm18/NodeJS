import { Request, Response } from "express";
import { Warehouse } from "../models/warehouse.model";

export const getWarehouses = async (req: Request, res: Response) => {
    try {
        const warehouses = await Warehouse.findAll();
        res.json(warehouses);      
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las bodegas", error });
    }
};

export const createWarehouse = async (req: Request, res: Response) => {
    try {
        const { name, address } = req.body;
        const newWarehouse = await Warehouse.create({ name, address });
        res.status(201).json(newWarehouse);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la bodega", error });
    }
};

export const updateWarehouse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, address, isActive } = req.body;

        const warehouse = await Warehouse.findByPk(id);
        if (!warehouse) return res.status(404).json({ message: "Bodega no encontrada" });

        warehouse.name = name ?? warehouse.name;
        warehouse.address = address ?? warehouse.address;
        warehouse.isActive = isActive ?? warehouse.isActive;

        await warehouse.save();
        res.json({ message: "Bodega actualizada exitosamente", warehouse })
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la bodega", error });
    }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const warehouse = await Warehouse.findByPk(id);
        if(!warehouse) return res.status(404).json({ message: "Bodega no encontrada" });

        await warehouse.destroy();
        res.json({ message: "Bodega eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la bodega", error });
    }
}