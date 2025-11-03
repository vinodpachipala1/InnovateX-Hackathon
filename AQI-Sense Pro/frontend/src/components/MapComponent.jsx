import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#22d3ee') => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="41" viewBox="0 0 32 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="${color}"/>
      </svg>
    `)}`,
    iconSize: [32, 41],
    iconAnchor: [16, 41],
    popupAnchor: [0, -41],
  });
};

// Location marker icons
const locationIcon = createCustomIcon('#22d3ee'); // Blue for selected locations
const userLocationIcon = createCustomIcon('#ef4444'); // RED for user location 🎯

// Component to handle map movement
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
      console.log('🗺️ Map moved to:', center, 'Zoom:', zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log('Map clicked:', lat, lng);
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

// UPDATED: Added selectedLocation prop
const MapComponent = ({ onLocationSelect, selectedLocation, initialPosition = [28.6139, 77.2090] }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // NEW: Effect to handle external selectedLocation changes
  useEffect(() => {
    if (selectedLocation && mapReady) {
      console.log('📍 External location selected:', selectedLocation);
      const newPosition = [selectedLocation.lat, selectedLocation.lon];
      setSelectedPosition(newPosition);
      
      // Move map to the selected location
      setMapCenter(newPosition);
      setMapZoom(14); // Zoom to a comfortable level
    }
  }, [selectedLocation, mapReady]);

  // Check if geolocation is available
  const isGeolocationAvailable = () => {
    return 'geolocation' in navigator;
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!isGeolocationAvailable()) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      setLocationLoading(true);
      setLocationError('');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Got user location:', latitude, longitude);
          resolve([latitude, longitude]);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your location. ';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
              break;
          }
          
          setLocationError(errorMessage);
          setLocationLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeMap = async () => {
      try {
        console.log('🗺️ Initializing map...');
        
        // ALWAYS try to get user location first
        if (isGeolocationAvailable()) {
          console.log('📍 Attempting to get user location...');
          
          getCurrentLocation()
            .then((coords) => {
              if (mounted) {
                console.log('✅ User location found:', coords);
                setUserLocation(coords);
                setMapCenter(coords);
                setMapZoom(15);
                
                // Automatically select user's location
                onLocationSelect(coords[0], coords[1]);
              }
            })
            .catch((error) => {
              console.log('❌ User location failed, using default position');
              if (mounted) {
                setMapCenter(initialPosition);
              }
            })
            .finally(() => {
              if (mounted) {
                setMapReady(true);
                console.log('🗺️ Map ready!');
              }
            });
        } else {
          console.log('❌ Geolocation not available, using default');
          if (mounted) {
            setMapCenter(initialPosition);
            setMapReady(true);
          }
        }
      } catch (error) {
        console.error('Map initialization error:', error);
        if (mounted) {
          setMapError(true);
          setMapReady(true);
        }
      }
    };

    initializeMap();

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (mounted && !mapReady) {
        console.log('⏰ Map initialization timeout, showing map');
        if (!mapCenter) {
          setMapCenter(initialPosition);
        }
        setMapReady(true);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleLocationSelect = (lat, lng) => {
    console.log('Location selected:', lat, lng);
    const newPosition = [lat, lng];
    setSelectedPosition(newPosition);
    
    // Move map to the clicked location
    setMapCenter(newPosition);
    setMapZoom(14);
    
    onLocationSelect(lat, lng);
  };

  // ENHANCED: Now moves map to user location
  const handleUseCurrentLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      setUserLocation(coords);
      
      // Move map to user location
      setMapCenter(coords);
      setMapZoom(15);
      
      handleLocationSelect(coords[0], coords[1]);
      
      // Show success message
      setLocationError('');
      console.log('📍 Map moved to user location');
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  // Don't render map until we have a center position
  if (!mapReady || !mapCenter) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-96 bg-glass-dark rounded-2xl flex items-center justify-center border border-cyan-500/20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-cyan-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Finding your location...</p>
          <p className="text-cyan-400 text-sm mt-2">Loading your current position</p>
        </div>
      </motion.div>
    );
  }

  if (mapError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-96 bg-glass-dark rounded-2xl flex items-center justify-center border border-cyan-500/20"
      >
        <div className="text-center p-6">
          <div className="text-4xl mb-4 text-red-400">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Map Loading Error</h3>
          <p className="text-gray-300 mb-4">Please check your network connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent-cyan text-white px-4 py-2 rounded-lg hover:bg-accent-cyan/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-96 rounded-2xl overflow-hidden border border-cyan-500/20 relative"
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl"
        key={`map-${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`} // Added zoom to key
      >
        {/* Map controller for programmatic movement */}
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents onLocationSelect={handleLocationSelect} />
        
        {/* User location marker - NOW RED 🎯 */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="text-gray-900">
                <strong className="text-red-500">📍 Your Current Location</strong>
                <br />
                Lat: {userLocation[0].toFixed(4)}
                <br />
                Lon: {userLocation[1].toFixed(4)}
                <br />
                <span className="text-green-600 text-sm">✓ Automatically detected</span>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Selected location marker - STAYS BLUE */}
        {selectedPosition && (
          <Marker position={selectedPosition} icon={locationIcon}>
            <Popup>
              <div className="text-gray-900">
                <strong>🎯 Selected Location</strong>
                <br />
                Lat: {selectedPosition[0].toFixed(4)}
                <br />
                Lon: {selectedPosition[1].toFixed(4)}
                <br />
                <span className="text-blue-600 text-sm">✓ Currently analyzing this location</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Success message when user location is found */}
      {userLocation && (
        <div className="absolute top-4 left-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-500/20 border border-green-500/30 text-green-300 p-3 rounded-lg text-sm backdrop-blur-sm max-w-xs"
          >
            <div className="flex items-start space-x-2">
              <span>✅</span>
              <div>
                <strong>Found Your Location!</strong>
                <p className="text-xs mt-1">Red marker shows where you are</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUseCurrentLocation}
          disabled={locationLoading}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {locationLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Locating...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>My Location</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Enhanced Instructions */}
      <div className="absolute bottom-4 left-4 right-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-glass-dark backdrop-blur-sm text-white p-3 rounded-lg text-sm text-center border border-cyan-500/20"
        >
          {selectedPosition ? (
            <p>
              <span className="text-cyan-400">🔵 Analyzing this location</span> •{' '}
              <span className="text-red-400">🔴 Your current location</span>
            </p>
          ) : userLocation ? (
            <p>
              <span className="text-red-400">🔴 Your location</span> •{' '}
              <span className="text-cyan-400">🔵 Click to select spots</span>
            </p>
          ) : (
            <p>🗺️ <strong>Click anywhere on the map</strong> to select location</p>
          )}
        </motion.div>
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="absolute top-20 right-4 left-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm backdrop-blur-sm"
          >
            <div className="flex items-start space-x-2">
              <span>⚠️</span>
              <div>
                <strong>Location Error</strong>
                <p className="text-xs mt-1">{locationError}</p>
                <button
                  onClick={() => setLocationError('')}
                  className="text-red-200 hover:text-red-100 text-xs mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;