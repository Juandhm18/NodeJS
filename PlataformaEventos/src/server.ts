import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize, { connectPostgres } from "./config/sequelize.config";
import dbconnection from "./config/mongoose.config";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import inscriptionRoutes from "./routes/inscription.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Rutas base
app.get("/", (_, res) => {
  res.send("API de gestión de eventos en funcionamiento");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/inscriptions", inscriptionRoutes);

// Función principal
const startServer = async () => {
  try {
    // Conexión a PostgreSQL
    await connectPostgres();

    // Sincronizar modelos (usar alter o force, no ambos)
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados correctamente con PostgreSQL");

    // Conexión a MongoDB
    await dbconnection();

    // Levantar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", (error as Error).message);
    process.exit(1); // Detiene la app si hay error crítico de conexión
  }
};

startServer();

