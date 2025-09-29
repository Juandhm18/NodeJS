import { type Request, type Response, type NextFunction } from "express";

const logger = (req:Request, res:Response, next:NextFunction):void => {
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};

export default logger;
