// Validation helper for coordinates
export const validateCoordinates = (lat, lon) => {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  
  if (isNaN(latNum) || isNaN(lonNum)) {
    return { valid: false, error: 'Coordinates must be valid numbers' };
  }
  
  if (latNum < -90 || latNum > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  
  if (lonNum < -180 || lonNum > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  
  return { valid: true, lat: latNum, lon: lonNum };
};

// Error response formatter
export const errorResponse = (message, statusCode = 500) => {
  return {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };
};

// Success response formatter
export const successResponse = (data, message = 'Success') => {
  return {
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  };
};