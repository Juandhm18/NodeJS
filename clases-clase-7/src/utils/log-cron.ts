import axios from "axios";
import cron from "node-cron";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Ruta donde se guardarán los logs
const logFilePath = path.join(__dirname, "logs.txt");

// Configuración de transporte para enviar correos (ejemplo con Gmail)
// Si usas Gmail, recuerda crear un App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "process.env.EMAIL_USER",  
    pass: "process.env.EMAIL_PASS" 
  }
});

// Función principal: hace petición, guarda log
async function ejecutarTarea() {
  try {
    // Petición HTTP (puedes cambiar a tu API real)
    const response = await axios.get("https://jsonplaceholder.typicode.com/users/1");
    const usuario = response.data;

    // Crear log
    const log = `Usuario: ${usuario.name}, Email: ${usuario.email}, Fecha: ${new Date().toISOString()}\n`;

    // Guardar log en archivo
    fs.appendFileSync(logFilePath, log, "utf8");
    console.log("Log guardado:", log);

    // -----------------------------------------------------------------
    // Variante 1: Enviar correo en cada ejecución 
    // -----------------------------------------------------------------
    
    await transporter.sendMail({
      from: '"Servicio Cron" <tu_correo@gmail.com>',
      to: "destinatario@correo.com",
      subject: "Nuevo log de usuario",
      text: log
    });
    console.log("Correo enviado con éxito");
    
  } catch (error: any) {
    console.error("Error en la tarea:", error.message);
  }
}

// -----------------------------------------------------------------
// Variante 2: Enviar un resumen diario con todos los logs
// -----------------------------------------------------------------
/*
async function enviarResumen() {
  try {
    const logs = fs.readFileSync(logFilePath, "utf8");

    await transporter.sendMail({
      from: '"Servicio Cron" <tu_correo@gmail.com>',
      to: "destinatario@correo.com",
      subject: "Resumen diario de logs",
      text: logs || "No se generaron logs hoy."
    });

    console.log("Resumen diario enviado");
    // Limpia el archivo después de enviar
    fs.writeFileSync(logFilePath, "", "utf8");
  } catch (error: any) {
    console.error("Error al enviar resumen:", error.message);
  }
}
*/
// -----------------------------------------------------------------
// Cron jobs
// -----------------------------------------------------------------

// Ejecuta la tarea cada minuto (para pruebas)
cron.schedule("* * * * *", ejecutarTarea);

// Envía el resumen diario a las 23:59
/*
cron.schedule("59 23 * * *", enviarResumen);
*/