import { Request, Response } from "express";
import IProduct from "../models/product.models";
import dbconnection from '../database/dbconnection';

export const getProduct = async (req: Request, res: Response) => {

  try {
    await dbconnection();
    const product = await IProduct.find().populate("category");
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const postProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, category, description, inStock } = req.body;
        const product = new IProduct({ name, price, category, description, inStock });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};

export const getProductID = async (req: Request, res: Response) => {
    try {
        const product = await IProduct.findById(req.params.id).populate("category");
        if (!product) return res.status(404).json({ message: "product not found" });
        res.json(product);    
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};

export const putProduct = async ( req: Request, res: Response) => {
  try {
    const product = await IProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "product not found" });
  res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
}

export const deleteProduct = async ( req: Request, res: Response) => {
  try {
    const product = await IProduct.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json({ message: "product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
}