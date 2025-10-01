import { Sequelize } from "sequelize";
import { env } from "../config/env.ts";

const sequelize = new Sequelize( env.DB_NAME, env.DB_USER, env.DB_PASS, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    logging: env.DB_LOGGING,
})

// Se pasa parametros de conexion
// new Sequelize ("nombre de la base de datos", "usuario", "contraseña", {objeto de configuracion})
// En objeto de configuracion va: 
// {host = donde se va a levantar la base de datos, EJ: localhost, 
// port = puerto de la base de datos, EJ: 5432, 
// dialect = tipo de base de datos, EJ: postgres, 
// logging = true o false si queremos ver las consultas que se hacen a la base de datos}

const initDB = async () : Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log(" Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    };
};

export { sequelize, initDB };