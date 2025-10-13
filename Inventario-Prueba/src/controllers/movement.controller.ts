import { Request, Response } from "express";
import { Movement } from "../models/movement.model";
import { Product } from "../models/product.model";
import { Warehouse } from "../models/warehouse.model";

export const createMovement = async (req: Request, res: Response) => {
  try {
    const { type, quantity, productId, sourceWarehouseId, destinationWarehouseId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    if (quantity <= 0) return res.status(400).json({ message: "La cantidad debe ser positiva" });

    switch (type) {
      case "entrada":
        product.stock += quantity;
        break;

      case "salida":
        if (product.stock < quantity)
          return res.status(400).json({ message: "Stock insuficiente para salida" });
        product.stock -= quantity;
        break;

      case "traslado":
        if (!sourceWarehouseId || !destinationWarehouseId)
          return res.status(400).json({ message: "Debe indicar bodegas de origen y destino" });
        if (sourceWarehouseId === destinationWarehouseId)
          return res.status(400).json({ message: "Las bodegas deben ser diferentes" });
        if (product.stock < quantity)
          return res.status(400).json({ message: "Stock insuficiente en origen" });
        product.stock -= quantity;
        break;

      default:
        return res.status(400).json({ message: "Tipo de movimiento inválido" });
    }

    await product.save();
    const movement = await Movement.create({
      type,
      quantity,
      productId,
      sourceWarehouseId,
      destinationWarehouseId,
    });

    res.status(201).json({ message: "Movimiento registrado", movement, product });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar movimiento", error });
  }
};

export const getMovements = async (_req: Request, res: Response) => {
  const movements = await Movement.findAll({
    include: [Product, Warehouse],
    order: [["createdAt", "DESC"]],
  });
  res.json(movements);
};
