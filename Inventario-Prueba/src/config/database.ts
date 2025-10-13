//Conexion a Postgres con sequelize
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Warehouse } from '../models/warehouse.model';
import { Movement } from '../models/movement.model';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

if (!DB_HOST || !DB_USERNAME || !DB_DATABASE) {
  throw new Error("Faltan variables de entorno para la base de datos");
}

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: DB_HOST,
    username: DB_USERNAME,
    port: Number(DB_PORT || 5432),
    password: DB_PASSWORD || "",
    database: DB_DATABASE,
    models: [User, Warehouse, Product, Movement],
    logging: false
});