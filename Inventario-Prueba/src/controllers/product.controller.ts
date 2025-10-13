import { Request, Response } from "express";
import { Product } from "../models/product.model";

export const createProduct = async (req: Request, res: Response) => {
    const { name, code, stock } = req.body;
    const exists = await Product.findOne({ where: { code } });
    if (exists) {
        return res.status(400).json({ message: "El producto ya existe" });
    }

    const product = await Product.create({ name, code, stock });
    res.status(201).json(product);
};

export const getProducts = async (_req: Request, res: Response) => {
  const products = await Product.findAll();
  res.json(products);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });

  await product.update(req.body);
  res.json(product)
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });

  await product.destroy();
  res.json({ message: "Producto eliminado correctamente" });
};
