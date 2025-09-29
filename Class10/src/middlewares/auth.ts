import { type Request, type Response, type NextFunction } from 'express';

const BEARER_TOKEN = "12345";

const auth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (token !== BEARER_TOKEN) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    next();
};

export default auth;