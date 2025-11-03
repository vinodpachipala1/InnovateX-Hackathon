import weatherService from '../services/weatherService.js';
import aiService from '../services/aiService.js';
import locationService from '../services/locationService.js';

class AQIController {
  async getAQIAdvice(req, res) {
    try {
      const { lat, lon, locationName, persona = 'general' } = req.body;

      if ((!lat || !lon) && !locationName) {
        return res.status(400).json({
          status: 'error',
          message: 'Either latitude/longitude or locationName is required'
        });
      }

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

      if (locationName && (!lat || !lon)) {
        const coords = await locationService.getCoordinatesFromName(locationName);
        finalLat = coords.lat;
        finalLon = coords.lon;
        locationInfo = {
          name: coords.name,
          fullName: coords.name,
          address: coords.address
        };
      } else {
        const searchResults = await locationService._makeRequest('search.php', {
          q: `${finalLat},${finalLon}`,
          limit: 1,
          addressdetails: 1
        });
        
        if (searchResults && searchResults.length > 0) {
          const result = searchResults[0];
          locationInfo = {
            name: result.display_name,
            fullName: result.display_name,
            address: result.address
          };
        } else {
          const locationData = await locationService.getLocationNameFromCoords(finalLat, finalLon);
          locationInfo = {
            name: locationData.fullName,
            fullName: locationData.fullName,
            address: locationData.address
          };
        }
      }

      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentAQI(finalLat, finalLon),
        weatherService.getAQIForecast(finalLat, finalLon)
      ]);

      const aiAdvice = await aiService.generateHealthAdvice({
        current: currentData,
        forecast: forecastData,
        location: { lat: finalLat, lon: finalLon, ...locationInfo }
      }, persona);

      const validatedForecast = Array.isArray(forecastData) 
        ? forecastData.map(item => typeof item === 'object' ? item.aqi || item.value : item)
        : [];

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
          current: {
            aqi: currentData.aqi,
            category: currentData.category,
            pm25: currentData.pm25,
            pm10: currentData.pm10,
            source: currentData.source
          },
          forecast: validatedForecast,
          advice: aiAdvice
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);

    } catch (error) {
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

  async searchLocation(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({
          status: 'error',
          message: 'Search query is required'
        });
      }
      
      const searchResults = await locationService._makeRequest('search.php', {
        q: query,
        limit: 5,
        addressdetails: 1
      });
      
      if (searchResults && searchResults.length > 0) {
        const results = searchResults.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          type: result.type,
          importance: result.importance,
          address: result.address
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
      if (error.message.includes('Location not found') || error.message.includes('No locations found')) {
        return res.status(404).json({
          status: 'error',
          message: 'No locations found for your search'
        });
      }

      if (error.message.includes('API key')) {
        return res.status(500).json({
          status: 'error',
          message: 'Location service configuration error'
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Error searching for location: ' + error.message
      });
    }
  }

  async searchLocationAdvanced(req, res) {
    try {
      const { query, country, type, limit = 5 } = req.body;

      if (!query) {
        return res.status(400).json({
          status: 'error',
          message: 'Search query is required'
        });
      }
      
      const params = {
        q: query,
        limit: Math.min(limit, 10),
        addressdetails: 1
      };

      if (country) params.country = country;
      if (type) params.type = type;

      const searchResults = await locationService._makeRequest('search.php', params);
      
      if (searchResults && searchResults.length > 0) {
        const results = searchResults.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          type: result.type,
          importance: result.importance,
          address: result.address,
          boundingbox: result.boundingbox
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
      res.status(500).json({
        status: 'error',
        message: 'Error searching for location: ' + error.message
      });
    }
  }

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