import cron from 'node-cron';
import { getNasaApod } from '../service/apiService';
import { sendNasaSummaryEmail } from '../service/emailService';

cron.schedule('*/1 * * * *', async () => {
    console.log('Ejecutando tarea NASA APOD');

    try {
        const data = await getNasaApod();

        const subject = `Imagen de la NASA - ${data.date}`;
        const body = `
        <h2>${data.title}</h2>
        <p>${data.explanation}</p>
        <img src="${data.url}" alt="NASA Image" style="max-width: 500px;">`;

        await sendNasaSummaryEmail(subject, body);
        console.log('Correo enviado con exito');
    } catch(error){
        console.error('Error al ejecutar: ', error);
    }
});