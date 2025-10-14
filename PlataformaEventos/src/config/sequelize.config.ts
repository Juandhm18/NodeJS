import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  throw new Error("POSTGRES_URL no está definida en el archivo .env");
}

const sequelize = new Sequelize(POSTGRES_URL, {
  dialect: "postgres",
  logging: false, // Cambia a console.log si quieres ver las queries
});

export const connectPostgres = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a PostgreSQL establecida correctamente");
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", (error as Error).message);
    throw new Error("No se pudo establecer la conexión con PostgreSQL");
  }
};

export default sequelize;
