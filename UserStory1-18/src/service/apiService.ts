import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = process.env.NASA_API_KEY;

export async function getNasaApod(): Promise<any> {
  try {
    const response = await axios.get(NASA_API_URL, {
      params: {
        api_key: NASA_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener la imagen de la NASA:', error);
    throw new Error('No se pudo obtener la imagen del día');
  }
}