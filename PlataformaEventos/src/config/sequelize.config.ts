import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URL as string, {
    dialect: "postgres",
    logging: false
});

export const connectPostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexion a PostgreSQL exitosa");
    } catch (error) {
        console.log("Error conectando PostgreSQL", error);
    }
};

export default sequelize;