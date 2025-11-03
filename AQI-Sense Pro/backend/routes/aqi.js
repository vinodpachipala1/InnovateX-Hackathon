import express from 'express';
import aqiController from '../controllers/aqiController.js';

const router = express.Router();

router.post('/aqi-advice', aqiController.getAQIAdvice);


router.post('/search-location', aqiController.searchLocation);

router.post('/aqi', aqiController.getAQIAdvice);
router.get('/aqi/health', aqiController.healthCheck);

export default router;