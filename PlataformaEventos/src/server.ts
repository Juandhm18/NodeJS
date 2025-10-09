import express = require("express");
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/sequelize.config";
import dbconnection from "./config/mongoose.config";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import inscriptionRoutes from "./routes/inscription.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API de gestion de eventos");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/inscriptions", inscriptionRoutes);

const startServer = async () => {
    try {
        await sequelize.query(`DROP TYPE IF EXISTS "enum_usuarios_rol" CASCADE;`);
        console.log("Tipo ENUM 'enum_usuarios_rol' eliminado (si existía)");

        // Sincronizar modelos
        await sequelize.sync({ force: false });
        console.log("Base de datos sincronizada");

        await sequelize.sync({alter: true});
        await dbconnection();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
        console.log(`Servido conrriendo en puerto ${PORT}`)
});
    } catch (error) {
        console.log("ERROR iniciando servidor:", error);
    }
};

startServer();

