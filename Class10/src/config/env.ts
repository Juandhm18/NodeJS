import 'dotenv/config';

export const env = {
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_NAME: process.env.DB_NAME ?? 'Week4',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASS: process.env.DB_PASS ?? '',
  DB_SSL: (process.env.DB_SSL ?? 'false') === 'true',
  DB_LOGGING: (process.env.DB_LOGGING ?? 'false') === 'true',
};