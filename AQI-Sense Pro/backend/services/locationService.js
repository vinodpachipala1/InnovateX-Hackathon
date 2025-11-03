import axios from 'axios';

const LOCATIONIQ_API_KEY = 'pk.69e6fd028d474074cc55eed7bcac2f7b'; 

class LocationService {
  constructor(apiKey) {
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn("LocationService: API key is missing or is a placeholder. Get a key from https://locationiq.com/");
      this.apiKey = null;
    } else {
      this.apiKey = apiKey;
    }
    this.baseUrl = 'https://us1.locationiq.com/v1';
  }

  async _makeRequest(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error("LocationService API key is not configured.");
    }

    const requestParams = {
      key: this.apiKey,
      format: 'json',
      ...params,
    };

    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, { params: requestParams });
      return response.data;
    } catch (error) {
      let errorMsg = error.message;
      if (error.response && error.response.data && error.response.data.error) {
        errorMsg = error.response.data.error;
        if (error.response.status === 401) {
          errorMsg = "Invalid or missing API key.";
        }
      }
      throw new Error(`LocationIQ API error: ${errorMsg}`);
    }
  }

  async getCoordinatesFromName(locationName) {
    try {
      const data = await this._makeRequest('search.php', {
        q: locationName,
        limit: 1
      });
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          name: result.display_name,
          address: result
        };
      }
      
      throw new Error('Location not found');
      
    } catch (error) {
      throw new Error(`Failed to find location: ${error.message}`);
    }
  }

  async getLocationNameFromCoords(lat, lon) {
    try {
      const data = await this._makeRequest('reverse.php', {
        lat: lat,
        lon: lon,
        zoom: 18,
        addressdetails: 1
      });
      
      if (data && data.display_name) {
        return {
          name: data.display_name,
          fullName: data.display_name,
          address: data.address || {}
        };
      }
      
      return {
        name: `Location (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
        fullName: 'Unknown Location',
        address: {}
      };
      
    } catch (error) {
      return {
        name: `Location (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
        fullName: 'Unknown Location',
        address: {}
      };
    }
  }

  async searchLocations(query, limit = 5) {
    try {
      const data = await this._makeRequest('search.php', {
        q: query,
        limit: limit,
        addressdetails: 1
      });
      
      if (data && data.length > 0) {
        return data.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          type: result.type,
          importance: result.importance,
          address: result,
          boundingbox: result.boundingbox
        }));
      }
      
      return [];
      
    } catch (error) {
      throw new Error(`Failed to search locations: ${error.message}`);
    }
  }
}

export default new LocationService(LOCATIONIQ_API_KEY);