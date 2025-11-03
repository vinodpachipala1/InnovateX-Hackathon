import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aqiRoutes from './routes/aqi.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "https://aqi-sense-pro.vercel.app",
    credentials: true,
  })
);

app.set("trust proxy", 1);


app.use(cors());
app.use(express.json());

app.use('/api', aqiRoutes);




app.listen(PORT, () => {
  console.log(`AQI Sense Backend running on port ${PORT}`);
});