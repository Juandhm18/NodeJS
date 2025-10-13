import express from "express";
import { sequelize } from "./config/database";
import authRoutes from "./routes/auth.routes";
import warehouseRoutes from "./routes/warehouses.routes";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import movementRoutes from "./routes/movement.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/movements", movementRoutes);

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Conexión a la base de datos establecida");

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}
main();

//