import express from 'express';
import pingRouter from './routes/api.route';

const app = express();

// Middleware global
app.use(express.json());

// Rutas
app.use('/ping', pingRouter);

export default app;