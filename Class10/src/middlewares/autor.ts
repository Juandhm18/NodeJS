import { type Request, type Response, type NextFunction } from "express";

const autor = (req: Request, res: Response, next: NextFunction):void => {
    const {title, author} = req.body;
    if (!title || !author) {
        res.status(400).json({ message: "Title and author are required" });
        return;
    }
    next();
}

export default autor;