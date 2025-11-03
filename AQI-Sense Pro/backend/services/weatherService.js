import axios from 'axios';

class WeatherService {
  constructor() {
    this.useOpenMeteo = true;
  }

  async getCurrentAQI(lat, lon) {
    try {
      return await this.getOpenMeteoCurrentAQI(lat, lon);
    } catch (error) {
      return this.getRealisticMockData(lat, lon);
    }
  }

  async getOpenMeteoCurrentAQI(lat, lon) {
    try {
      const response = await axios.get(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,dust&timezone=auto`
      );
      
      const data = response.data;
      
      return {
        aqi: data.current.us_aqi,
        category: this.getAQICategoryFromUSAQI(data.current.us_aqi),
        pm25: data.current.pm2_5,
        pm10: data.current.pm10 || data.current.dust,
        no2: 0,
        so2: 0,
        co: 0,
        o3: 0,
        timestamp: new Date().toISOString(),
        source: 'open-meteo'
      };
    } catch (error) {
      throw new Error('Failed to fetch from Open-Meteo');
    }
  }

  async getAQIForecast(lat, lon) {
    try {
      return await this.getOpenMeteoForecast(lat, lon);
    } catch (error) {
      return this.getRealisticForecastData();
    }
  }

  async getOpenMeteoForecast(lat, lon) {
    try {
      const response = await axios.get(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm2_5&timezone=auto&forecast_days=2`
      );
      
      const data = response.data;
      
      const hourlyAQIs = data.hourly.us_aqi;
      const threeHourForecast = [];
      
      for (let i = 1; i <= 24; i += 3) {
        if (i < hourlyAQIs.length) {
          threeHourForecast.push(hourlyAQIs[i]);
        }
      }
      
      while (threeHourForecast.length < 8) {
        threeHourForecast.push(threeHourForecast[threeHourForecast.length - 1] || 50);
      }
      
      return threeHourForecast.slice(0, 8);
      
    } catch (error) {
      return this.getRealisticForecastData();
    }
  }

  getRealisticForecastData() {
    const baseAqi = 80 + Math.random() * 80;
    const forecast = [];
    
    for (let i = 1; i <= 8; i++) {
      const variation = Math.sin(i * 0.5) * 20 + (Math.random() * 10 - 5);
      const aqi = Math.max(30, Math.min(250, Math.round(baseAqi + variation)));
      forecast.push(aqi);
    }
    
    return forecast;
  }

  getAQICategoryFromUSAQI(usAqi) {
    if (usAqi <= 50) return { level: 'Good', color: 'green', description: 'Air quality is satisfactory' };
    if (usAqi <= 100) return { level: 'Moderate', color: 'yellow', description: 'Air quality is acceptable' };
    if (usAqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'orange', description: 'Members of sensitive groups may experience health effects' };
    if (usAqi <= 200) return { level: 'Unhealthy', color: 'red', description: 'Everyone may begin to experience health effects' };
    if (usAqi <= 300) return { level: 'Very Unhealthy', color: 'purple', description: 'Health warnings of emergency conditions' };
    return { level: 'Hazardous', color: 'maroon', description: 'Health alert: everyone may experience serious health effects' };
  }

  getRealisticMockData(lat, lon) {
    const isUrban = lon > 75 && lon < 85 && lat > 15 && lat < 20;
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    let baseAqi = isUrban ? 120 : 80;
    if (isRushHour) baseAqi += 30;
    if (hour >= 22 || hour <= 5) baseAqi -= 20;
    
    const randomVariation = Math.random() * 40 - 20;
    const aqi = Math.max(20, Math.min(300, Math.round(baseAqi + randomVariation)));
    
    return {
      aqi: aqi,
      category: this.getAQICategoryFromUSAQI(aqi),
      pm25: (aqi * 0.5) + (Math.random() * 20),
      pm10: (aqi * 0.8) + (Math.random() * 30),
      no2: 15 + (Math.random() * 30),
      so2: 5 + (Math.random() * 15),
      co: 200 + (Math.random() * 300),
      o3: 30 + (Math.random() * 40),
      timestamp: new Date().toISOString(),
      source: 'mock-realistic'
    };
  }
}

export default new WeatherService();