import app from './app';
import dotenv from 'dotenv';
import './cron/nasaJob';
import { transporter } from './service/emailService';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
