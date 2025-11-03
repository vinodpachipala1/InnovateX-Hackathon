import weatherService from '../services/weatherService.js';
import aiService from '../services/aiService.js';
import locationService from '../services/locationService.js';

class AQIController {
  // Enhanced: Get AQI data + AI health advice with location name
  async getAQIAdvice(req, res) {
    try {
      const { lat, lon, locationName, persona = 'general' } = req.body;

      // Validate input - either coordinates or location name required
      if ((!lat || !lon) && !locationName) {
        return res.status(400).json({
          status: 'error',
          message: 'Either latitude/longitude or locationName is required'
        });
      }

      // Validate persona
      const validPersonas = ['general', 'athlete', 'children', 'sensitive'];
      if (!validPersonas.includes(persona)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid persona type'
        });
      }

      let finalLat = lat;
      let finalLon = lon;
      let locationInfo = {};

      // If location name provided, get coordinates first
      if (locationName && (!lat || !lon)) {
        console.log(`📍 Converting location name to coordinates: ${locationName}`);
        const coords = await locationService.getCoordinatesFromName(locationName);
        finalLat = coords.lat;
        finalLon = coords.lon;
        locationInfo = {
          name: coords.name,
          fullName: coords.name,
          address: coords.address
        };
      } else {
        // If coordinates provided, get location name
        console.log(`📍 Getting location name for coordinates: ${finalLat}, ${finalLon}`);
        const locationData = await locationService.getLocationNameFromCoords(finalLat, finalLon);
        locationInfo = locationData;
      }

      console.log(`🧠 Fetching AQI + AI advice for: ${finalLat}, ${finalLon} (${persona}) - ${locationInfo.name}`);

      // Fetch AQI data
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentAQI(finalLat, finalLon),
        weatherService.getAQIForecast(finalLat, finalLon)
      ]);

      // Generate AI health advice - THIS WAS MISSING!
      const aiAdvice = await aiService.generateHealthAdvice({
        current: currentData,
        forecast: forecastData,
        location: { lat: finalLat, lon: finalLon, ...locationInfo }
      }, persona);

      // Validate forecast data is array of numbers
      const validatedForecast = Array.isArray(forecastData) 
        ? forecastData.map(item => typeof item === 'object' ? item.aqi || item.value : item)
        : [];

      console.log(`📊 Forecast Data:`, validatedForecast);
      console.log(`📊 Current AQI: ${currentData.aqi}`);

      // Prepare enhanced response that matches frontend expectations
      const response = {
        status: 'success',
        data: {
          location: {
            lat: parseFloat(finalLat),
            lon: parseFloat(finalLon),
            name: locationInfo.name,
            fullName: locationInfo.fullName,
            address: locationInfo.address
          },
          persona: persona,
          // Match frontend structure - flatten current data
          current: {
            aqi: currentData.aqi,
            category: currentData.category,
            pm25: currentData.pm25,
            pm10: currentData.pm10,
            source: currentData.source
          },
          // Ensure forecast is array of numbers
          forecast: validatedForecast,
          advice: aiAdvice
        },
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Success: AQI data for ${locationInfo.name} (Current: ${currentData.aqi}, Forecast: ${validatedForecast.join(', ')})`);
      res.json(response);

    } catch (error) {
      console.error('AQI Advice Controller Error:', error.message);
      
      if (error.message.includes('Location not found') || error.message.includes('Failed to find location')) {
        return res.status(404).json({
          status: 'error',
          message: 'Location not found. Please try a different search term.'
        });
      }

      if (error.message.includes('Failed to fetch')) {
        return res.status(503).json({
          status: 'error',
          message: 'Weather service temporarily unavailable'
        });
      }

      if (error.message.includes('No air quality data')) {
        return res.status(404).json({
          status: 'error',
          message: 'No air quality data available for this location'
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Internal server error while fetching AQI data: ' + error.message
      });
    }
  }

  // New endpoint: Search location by name
  async searchLocation(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({
          status: 'error',
          message: 'Search query is required'
        });
      }

      console.log(`🔍 Searching location: ${query}`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const results = data.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          type: result.type,
          importance: result.importance
        }));

        res.json({
          status: 'success',
          data: results,
          message: `Found ${results.length} locations`
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'No locations found for your search'
        });
      }

    } catch (error) {
      console.error('Location search error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error searching for location'
      });
    }
  }

  // Keep existing health check method
  async healthCheck(req, res) {
    try {
      await weatherService.getCurrentAQI(28.6139, 77.2090);
      
      res.json({
        status: 'success',
        message: 'AQI service is operational',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        message: 'AQI service is experiencing issues',
        error: error.message
      });
    }
  }
}

export default new AQIController();