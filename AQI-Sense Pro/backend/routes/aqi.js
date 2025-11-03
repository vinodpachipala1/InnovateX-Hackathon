import express from 'express';
import aqiController from '../controllers/aqiController.js';

const router = express.Router();

// Enhanced AQI endpoint with AI advice
router.post('/aqi-advice', aqiController.getAQIAdvice);

// New location search endpoint
router.post('/search-location', aqiController.searchLocation);

// Keep existing endpoints for backward compatibility
router.post('/aqi', aqiController.getAQIAdvice);
router.get('/aqi/health', aqiController.healthCheck);

export default router;