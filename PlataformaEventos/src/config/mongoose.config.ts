import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbconnection = async (): Promise<void> => {
  const mongodbAtlas = process.env.MONGO_URL;

  if (!mongodbAtlas) {
    throw new Error("MONGO_URL no está definida en el archivo .env");
  }

  try {
    await mongoose.connect(mongodbAtlas);
    console.log(" Conexión a MongoDB establecida correctamente");
  } catch (error) {
    console.error(" Error al conectar con MongoDB:", (error as Error).message);
    throw new Error("Error al iniciar la base de datos MongoDB. Ver logs.");
  }

  // Listeners para manejar reconexiones o cierres
  mongoose.connection.on("disconnected", () => {
    console.warn(" Conexión a MongoDB perdida. Intentando reconectar...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log(" Reconectado a MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error(" Error en la conexión de MongoDB:", err);
  });
};

export default dbconnection;
