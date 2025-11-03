import React from 'react';
import { motion } from 'framer-motion';

const AQICard = ({ aqiData, loading, location, locationName, onGetAQI, selectedLocation }) => {
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  const getAQIBadge = (aqi) => {
    const color = aqi <= 50 ? 'bg-green-500' : 
                 aqi <= 100 ? 'bg-yellow-500' : 
                 aqi <= 150 ? 'bg-orange-500' : 
                 aqi <= 200 ? 'bg-red-500' : 'bg-purple-500';
    
    return (
      <motion.span 
        className={`${color} text-white px-3 py-1 rounded-full text-sm font-medium`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {getAQILevel(aqi)}
      </motion.span>
    );
  };

  // Get trend icon based on forecast data
  const getTrendIcon = () => {
    if (!aqiData?.forecast || aqiData.forecast.length < 3) return '➡️';
    
    const first = aqiData.forecast[0];
    const last = aqiData.forecast[aqiData.forecast.length - 1];
    const change = last - first;
    
    if (change > 20) return '📉';
    if (change > 10) return '↘️';
    if (change < -20) return '📈';
    if (change < -10) return '↗️';
    return '➡️';
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-xl shadow-cyan-500/5"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
        <span className="text-accent-cyan-light">🌤️</span>
        <span>Air Quality Index</span>
      </h3>
      
      {/* Enhanced Location Display */}
      {location && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
        >
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-cyan-400">📍</span>
            <div className="flex-1">
              <div className="text-cyan-300 font-semibold text-base">
                {locationName || 'Selected Location'}
              </div>
              <div className="text-gray-400 text-xs font-mono mt-1">
                {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {aqiData ? (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Main AQI Display */}
          <div className={`text-6xl font-bold mb-2 ${getAQIColor(aqiData.aqi)}`}>
            {aqiData.aqi}
          </div>
          
          {/* AQI Badge with Trend */}
          <div className="mb-4 flex items-center justify-center space-x-3">
            {getAQIBadge(aqiData.aqi)}
            {aqiData.forecast && (
              <motion.span 
                className="text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {getTrendIcon()}
              </motion.span>
            )}
          </div>

          {/* Pollutant Details */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3 mt-4"
          >
            <div className="text-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="text-cyan-300 text-sm font-medium">PM2.5</div>
              <div className="text-white font-semibold text-lg">
                {aqiData.pm25 ? aqiData.pm25.toFixed(1) : 'N/A'}
              </div>
              <div className="text-gray-400 text-xs">μg/m³</div>
            </div>
            
            <div className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-emerald-300 text-sm font-medium">PM10</div>
              <div className="text-white font-semibold text-lg">
                {aqiData.pm10 ? aqiData.pm10.toFixed(1) : 'N/A'}
              </div>
              <div className="text-gray-400 text-xs">μg/m³</div>
            </div>
          </motion.div>

          {/* Data Source Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 pt-3 border-t border-cyan-500/20"
          >
            <p className="text-cyan-400 text-xs">
              📡 Data source: {aqiData.source || 'live monitoring'}
            </p>
          </motion.div>

          {/* Refresh Button */}
          <motion.button
            onClick={onGetAQI}
            disabled={loading}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(34, 211, 238, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 bg-gradient-to-r from-accent-cyan to-accent-emerald text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-accent-cyan/30 transition-all duration-300 disabled:opacity-50 border border-accent-cyan/40"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  🔄
                </motion.span>
                <span>Refreshing Data...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🔄</span>
                <span>Refresh Data</span>
              </div>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-4 text-accent-cyan-light">🌤️</div>
          <p className="text-gray-300 mb-4">Select a location to see AQI data</p>
          <p className="text-cyan-400 text-sm mb-6">Real-time air quality analysis</p>
          
          {/* Get AQI Button - Only show when location is selected but no data */}
          {selectedLocation && (
            <motion.button
              onClick={onGetAQI}
              disabled={loading}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(34, 211, 238, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-emerald text-white px-6 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-accent-cyan/40 transition-all duration-300 disabled:opacity-50 border border-accent-cyan/40 relative overflow-hidden"
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />

              <span className="relative z-10 flex items-center space-x-2 w-full justify-center whitespace-nowrap">
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      🔄
                    </motion.span>
                    <span>Analyzing Air Quality...</span>
                  </>
                ) : (
                  <>
                    <span>🌬️</span>
                    <span>Get AQI Analysis</span>
                  </>
                )}
              </span>
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AQICard;