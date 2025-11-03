import axios from 'axios';

class LocationService {
  // Convert location name to coordinates
  async getCoordinatesFromName(locationName) {
    try {
      console.log(`📍 Searching coordinates for: ${locationName}`);
      
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          name: result.display_name,
          address: result
        };
      }
      
      throw new Error('Location not found');
      
    } catch (error) {
      console.error('Location service error:', error.message);
      throw new Error(`Failed to find location: ${error.message}`);
    }
  }

  // Get location name from coordinates (reverse geocoding)
  async getLocationNameFromCoords(lat, lon) {
    try {
      console.log(`📍 Getting location name for: ${lat}, ${lon}`);
      
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12&addressdetails=1`
      );
      
      if (response.data && response.data.address) {
        const { address } = response.data;
        
        // Build a nice location name
        const locationName = 
          address.city ||
          address.town || 
          address.village ||
          address.municipality ||
          address.county ||
          address.state ||
          address.country ||
          'Unknown Location';
        
        return {
          name: locationName,
          fullName: response.data.display_name,
          address: address
        };
      }
      
      return {
        name: `Location (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
        fullName: 'Unknown Location',
        address: {}
      };
      
    } catch (error) {
      console.error('Reverse geocoding error:', error.message);
      return {
        name: `Location (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
        fullName: 'Unknown Location',
        address: {}
      };
    }
  }
}

export default new LocationService();