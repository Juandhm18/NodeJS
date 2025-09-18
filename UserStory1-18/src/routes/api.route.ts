import { Router } from 'express';
import { getNasaApod } from '../service/apiService';

const router = Router();

// GET /data
router.get('/data', async (req, res) => {
  try{
    const nasaData = await getNasaApod();
    res.json({
      success: true,
      data: {
        title: nasaData.title,
        date: nasaData.date,
        explanation: nasaData.explanation,
        imagaUrl:nasaData.url
      }
    })
  } catch (error){
    res.status(500).json({success: false, message: 'error al obtener los datos'})
  }
});

export default router;
