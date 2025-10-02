import { Request, Response, NextFunction } from "express";

export const validateProduct = (req: Request, res: Response, next:NextFunction) => {
    const { name, price, category} = req.body;

    if(!name || typeof name !== "string"){
        return res.status(404).json({ message: "Product name is required"})
    }

    if (price === undefined || typeof price !== "number" || price < 0 ){
        return res.status(404).json({ message: "Product price is required"})
    }

    if (!category){
        return res.status(404).json({ message: "Category is required"})
    }

  // Si todo está bien → continuar
    next();
}