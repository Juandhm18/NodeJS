import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Warehouse } from '../models/warehouse.model';
import { Movement } from '../models/movement.model';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
} = process.env;

let sequelize: Sequelize;

// Si estamos en entorno de test, no validar variables
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    models: [User, Warehouse, Product, Movement],
  });

  console.log('🧪 Usando base de datos SQLite en memoria para testing');
} else {
  // Validación solo para desarrollo / producción
  if (!DB_HOST || !DB_USERNAME || !DB_DATABASE) {
    throw new Error('Faltan variables de entorno para la base de datos');
  }

  sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST,
    username: DB_USERNAME,
    port: Number(DB_PORT || 5432),
    password: DB_PASSWORD || '',
    database: DB_DATABASE,
    logging: false,
    models: [User, Warehouse, Product, Movement],
  });

  console.log('🐘 Conectado a PostgreSQL');
}

export { sequelize };