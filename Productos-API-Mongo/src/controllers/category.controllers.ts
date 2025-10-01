import { Request, Response } from 'express'
import ICategory from '../models/category.models'

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await ICategory.find();
        res.json(categories)
    }  catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const category = new ICategory({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

export const getCategoryIdD = async (req: Request, res: Response) => {
    try {
        const category = await ICategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category" });
    }
};