// import { Sequelize } from "sequelize";




// const sequelize = new Sequelize("club_books", "postgres", "tu_password", {
//   host: "db.anmttvhfaybelmgfzkmr.supabase.co",
//   dialect: "postgres",
//   logging: false,
//   port: 5432,


// });


// const sequelize = new Sequelize('postgresql://postgres:juandhm20@db.anmttvhfaybelmgfzkmr.supabase.co:5432/postgres')

// export default sequelize;


// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
// dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT?: string;
      PORT?: string;
    }
}
}

// const sequelize = new Sequelize(
//   process.env.DB_NAME as string,
//   process.env.DB_USER as string,
//   process.env.DB_PASS as string,
//   {
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT) || 5432,
//     dialect: "postgres",
//     logging: false,
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );

// export default sequelize;


import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DB_PASS)
export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      family: 4, 
    },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a Supabase exitosa.");
  } catch (error) {
    console.error("❌ Error al conectar a Supabase:", error);
  } finally {
    await sequelize.close();
  }
})();


