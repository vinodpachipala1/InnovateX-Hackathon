import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aqiRoutes from './routes/aqi.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

console.log(process.env.GEMINI_API_KEY);
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', aqiRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AQI Sense Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('/', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});


app.listen(PORT, () => {
  console.log(`AQI Sense Backend running on port ${PORT}`);
});