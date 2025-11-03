import React from 'react';
import { motion } from 'framer-motion';

const ChartComponent = ({ forecastData, loading, locationName, aqiData }) => {
  if (loading) {
    return (
      <motion.div className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 h-64">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-600 rounded"></div>
        </div>
      </motion.div>
    );
  }

  // Combine current AQI with forecast data - FIXED: use aqiData.aqi instead of aqiData.current.aqi
  const displayData = aqiData && aqiData.aqi !== undefined ? 
    [aqiData.aqi, ...(forecastData || []).slice(0, 7)] : 
    null;

  // Calculate dynamic max value
  const getMaxValue = () => {
    if (!displayData) return 150;
    const max = Math.max(...displayData);
    return Math.max(max * 1.1, 150);
  };

  // Calculate bar height
  const calculateBarHeight = (value) => {
    const maxValue = getMaxValue();
    const calculatedHeight = (value / maxValue) * 85;
    return Math.max(calculatedHeight, 10);
  };

  // Get color based on AQI value
  const getBarColor = (value) => {
    if (value <= 50) return 'from-green-400 to-green-500';
    if (value <= 100) return 'from-yellow-400 to-yellow-500';
    if (value <= 150) return 'from-orange-400 to-orange-500';
    if (value <= 200) return 'from-red-400 to-red-500';
    if (value <= 300) return 'from-purple-400 to-purple-500';
    return 'from-purple-600 to-red-600';
  };

  // Get color name for display
  const getColorName = (value) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Unhealthy for Sensitive';
    if (value <= 200) return 'Unhealthy';
    if (value <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Generate time labels - Now starts with "Now" for current reading
  const getTimeLabels = () => {
    if (!displayData) return [];
    
    const now = new Date();
    return displayData.map((_, index) => {
      if (index === 0) return 'Now';
      
      const hoursToAdd = index * 3;
      const time = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
      
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      }).toLowerCase();
    });
  };

  const maxValue = getMaxValue();
  const timeLabels = displayData ? getTimeLabels() : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 min-h-64 shadow-xl shadow-cyan-500/5"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">
          {locationName ? `AQI Forecast - ${locationName.split(',')[0]}` : 'AQI Forecast'}
        </h3>
        {displayData && (
          <div className="flex flex-col items-end">
            <div className="text-sm text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded mb-1">
              Current: {displayData[0]} AQI
            </div>
            <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
              Max: {Math.max(...displayData)} AQI
            </div>
          </div>
        )}
      </div>

      {/* AQI COLOR LEGEND */}
      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-black/20 rounded-lg border border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
          <span className="text-xs text-green-400 font-medium">Good (0-50)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded"></div>
          <span className="text-xs text-yellow-400 font-medium">Moderate (51-100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded"></div>
          <span className="text-xs text-orange-400 font-medium">Sensitive (101-150)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded"></div>
          <span className="text-xs text-red-400 font-medium">Unhealthy (151-200)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded"></div>
          <span className="text-xs text-purple-400 font-medium">Very Poor (201-300)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-red-600 rounded"></div>
          <span className="text-xs text-purple-400 font-medium">Hazardous (301+)</span>
        </div>
      </div>
      
      {displayData ? (
        <div className="h-40 relative flex">
          {/* Vertical AQI Scale - Left Side */}
          <div className="flex flex-col justify-between h-32 mr-3 py-1">
            <span className="text-xs text-gray-400 font-medium">{Math.round(maxValue)}</span>
            <span className="text-xs text-gray-400 font-medium text-center">AQI</span>
            <span className="text-xs text-gray-400 font-medium">0</span>
          </div>

          {/* Chart Content */}
          <div className="flex-1 h-40 relative">
            {/* AQI Zone Background */}
            <div className="absolute bottom-0 left-0 right-0 h-32 flex flex-col justify-end">
              <div className="flex flex-col h-full w-full">
                <div className="flex-1 bg-purple-500/5 border-t border-purple-500/20"></div>
                <div className="flex-1 bg-red-500/5 border-t border-red-500/20"></div>
                <div className="flex-1 bg-orange-500/5 border-t border-orange-500/20"></div>
                <div className="flex-1 bg-yellow-500/5 border-t border-yellow-500/20"></div>
                <div className="flex-1 bg-green-500/5"></div>
              </div>
            </div>

            {/* Chart Bars */}
            <div className="h-40 flex items-end justify-between px-2 relative z-10">
              {displayData.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group relative mx-1">
                  {/* Bar Container */}
                  <div className="flex flex-col items-center w-full h-32 justify-end">
                    
                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${calculateBarHeight(value)}%`
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.8,
                        type: "spring"
                      }}
                      className={`bg-gradient-to-t ${getBarColor(value)} w-10 rounded-t-lg transition-all duration-300 hover:brightness-110 cursor-pointer shadow-lg border border-white/20 relative ${
                        index === 0 ? 'ring-2 ring-cyan-400 ring-opacity-50' : '' // Highlight current reading
                      }`}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900/95 text-white text-xs py-2 px-3 rounded-lg border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-20">
                        <div className="font-bold text-cyan-300">{timeLabels[index]}</div>
                        <div className="font-semibold text-base">AQI: {value}</div>
                        <div className={`text-xs font-medium mt-1 ${
                          value <= 50 ? 'text-green-400' :
                          value <= 100 ? 'text-yellow-400' :
                          value <= 150 ? 'text-orange-400' :
                          value <= 200 ? 'text-red-400' : 'text-purple-400'
                        }`}>
                          {getColorName(value)}
                        </div>
                        {index === 0 && (
                          <div className="text-cyan-400 text-xs mt-1 font-medium">
                            ⭐ Current Reading
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Time label */}
                  <div className="text-xs text-gray-300 mt-2 font-medium text-center min-h-[20px]">
                    {timeLabels[index]}
                  </div>
                  
                  {/* Value below bar */}
                  <div className={`text-xs font-semibold mt-1 px-1 rounded border ${
                    value <= 50 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    value <= 100 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    value <= 150 ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                    value <= 200 ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  } ${index === 0 ? 'ring-1 ring-cyan-400' : ''}`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2 text-accent-cyan-light">📊</div>
            <p className="text-gray-300">No forecast data available</p>
            <p className="text-sm text-gray-500 mt-1">Search for a location to see AQI forecast</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChartComponent;