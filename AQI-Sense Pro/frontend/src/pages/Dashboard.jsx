import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import MapComponent from "../components/MapComponent";
import AQICard from "../components/AQICard";
import PersonaSelector from "../components/PersonaSelector";
import AIAdvice from "../components/AIAdvice";
import ChartComponent from "../components/ChartComponent";
import { AnimatePresence } from "framer-motion";

// Debounce hook
const useDebounce = (callback, delay) => {
  const [timeoutId, setTimeoutId] = useState(null);

  return useCallback(
    (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    },
    [callback, delay, timeoutId]
  );
};

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState("general");
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Enhanced location selection - now gets name from backend
  const handleLocationSelect = async (lat, lon, name = "") => {
    setSelectedLocation({ lat, lon });
    setAqiData(null);

    // Set temporary name, will be updated by backend
    setLocationName(
      name || `Location (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`
    );
  };

  // Debounced search function
  const debouncedSearch = useDebounce(async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/search-location",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setSuggestions(data.data.slice(0, 3)); // Show only top 3 suggestions
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Auto-suggest error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 600);

  // Auto-search when typing (debounced)
  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Search for location by name using backend
  const handleSearchLocation = async (query) => {
    if (!query.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/search-location",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setSearchResults(data.data);
        setShowSearchResults(true);
        setShowSuggestions(false); // Hide suggestions when showing full results
      } else {
        alert(data.message || "Location not found");
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location. Please try again.");
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle selection from suggestions
  const handleSuggestionSelect = (suggestion) => {
    handleLocationSelect(suggestion.lat, suggestion.lon, suggestion.name);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setShowSearchResults(false);
  };

  // Handle selection from search results
  const handleSearchResultSelect = (result) => {
    handleLocationSelect(result.lat, result.lon, result.name);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setShowSuggestions(false);
  };

  // Get AQI data - now gets location name from backend
  // In Dashboard.js - handleGetAQI function - UPDATED:
  const handleGetAQI = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/aqi-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: selectedLocation.lat,
          lon: selectedLocation.lon,
          persona: selectedPersona,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Use the new backend structure directly
        setAqiData({
          aqi: data.data.current.aqi,
          category: data.data.current.category.level,
          pm25: data.data.current.pm25,
          pm10: data.data.current.pm10,
          forecast: data.data.forecast, // Now directly from backend
          advice: data.data.advice,
          source: data.data.current.source,
        });

        // Update location name from backend response
        setLocationName(data.data.location.name);
      } else {
        alert("Failed to fetch AQI data: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching AQI:", error);
      alert("Error connecting to AQI service");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-accent-cyan-light to-accent-emerald bg-clip-text text-transparent"
        >
          Air Quality Dashboard
        </motion.h1>
        <motion.p variants={itemVariants} className="text-gray-300 text-center">
          Search or click on the map to check air quality and get AI health
          advice
        </motion.p>
      </motion.div>

      {/* Search Bar with Results */}
      <motion.div
        variants={itemVariants}
        className="max-w-2xl mx-auto mb-8 relative"
      >
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleSearchLocation(searchQuery)
            }
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
              if (searchResults.length > 0) setShowSearchResults(true);
            }}
            onBlur={() => {
              // Small delay to allow clicking on suggestions
              setTimeout(() => {
                setShowSuggestions(false);
                setShowSearchResults(false);
              }, 200);
            }}
            placeholder="Search for a location (e.g., Mumbai, Bangalore, Delhi...)"
            className="w-full bg-glass-dark backdrop-blur-xl border border-cyan-500/30 rounded-xl py-4 px-6 text-white placeholder-gray-400 
                 ring-2 ring-transparent 
                 focus:outline-none focus:border-cyan-400/50 focus:ring-cyan-500/20 
                 transition-all duration-300 pr-36"
          />
          <button
            onClick={() => handleSearchLocation(searchQuery)}
            disabled={searchLoading || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-accent-cyan to-accent-emerald text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                   w-36 hover:bg-gradient-to-r hover:from-accent-cyan/90 hover:to-accent-emerald/90"
          >
            {searchLoading ? (
              <div className="flex items-center space-x-2 justify-center whitespace-nowrap">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 justify-center whitespace-nowrap">
                <span>🔍</span>
                <span>Search</span>
              </div>
            )}
          </button>
        </div>
        {/* Auto-suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-glass-dark backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 z-50 max-h-48 overflow-y-auto"
            >
              <div className="p-2 text-xs text-cyan-400 font-medium border-b border-cyan-500/20">
                🔍 Quick suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                  className="p-3 border-b border-cyan-500/20 last:border-b-0 cursor-pointer transition-colors duration-200"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="text-white font-medium text-sm">
                    {suggestion.name}
                  </div>
                  <div className="text-cyan-300 text-xs mt-1">
                    {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-glass-dark backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 z-40 max-h-60 overflow-y-auto"
            >
              <div className="p-2 text-xs text-emerald-400 font-medium border-b border-cyan-500/20">
                📍 Search results
              </div>
              {searchResults.map((result, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                  className="p-4 border-b border-cyan-500/20 last:border-b-0 cursor-pointer transition-colors duration-200"
                  onClick={() => handleSearchResultSelect(result)}
                >
                  <div className="text-white font-medium">{result.name}</div>
                  <div className="text-cyan-300 text-sm mt-1">
                    {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-gray-400 text-sm mt-2 text-center">
          Start typing to see suggestions, or press Enter to search
        </p>
      </motion.div>

      {/* Main Dashboard Grid - UPDATED */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-6 mb-8" // This is now the main layout grid
      >
        {/* Left Column - Map + AI Advice */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 shadow-2xl shadow-cyan-500/10 h-[500px]" // Fixed height
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="text-accent-cyan-light">🗺️</span>
                Location Map
              </h2>

              <motion.button
                onClick={async () => {
                  try {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                          const { latitude, longitude } = pos.coords;
                          await handleLocationSelect(
                            latitude,
                            longitude,
                            "Your Current Location"
                          );
                        },
                        (error) => {
                          alert(
                            "Please allow location permissions in your browser settings to use this feature."
                          );
                        }
                      );
                    } else {
                      alert(
                        "Geolocation is not supported by your browser. Please click on the map directly."
                      );
                    }
                  } catch (error) {
                    console.error("Location error:", error);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300"
              >
                📍 Use My Location
              </motion.button>
            </div>
            <div className="h-[calc(100%-3rem)]">
              {/* Fixed height for map container */}
              <MapComponent
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
            </div>
          </motion.div>

          {/* AI Advice (MOVED HERE) */}
          <motion.div variants={itemVariants}>
            <AIAdvice
              advice={aqiData?.advice}
              persona={selectedPersona}
              loading={loading}
              locationName={locationName}
            />
          </motion.div>
        </div>

        {/* Right Column - Controls, Data, & Chart */}
        <div className="space-y-6">
          {/* AQI Card */}
          <motion.div variants={itemVariants}>
            <AQICard
              aqiData={aqiData}
              loading={loading}
              location={selectedLocation}
              locationName={locationName}
              onGetAQI={handleGetAQI}
              selectedLocation={selectedLocation}
            />
          </motion.div>

          {/* Persona Selector */}
          <motion.div variants={itemVariants}>
            <PersonaSelector
              selectedPersona={selectedPersona}
              onPersonaChange={setSelectedPersona}
            />
          </motion.div>

          {/* Chart (MOVED HERE) */}
          <motion.div variants={itemVariants}>
            <ChartComponent
              forecastData={aqiData?.forecast}
              loading={loading}
              locationName={locationName}
              aqiData={aqiData} // Add this prop
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Location Card */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-24 right-8 z-30"
          >
            <div className="bg-glass-dark backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-cyan-400 text-lg">📍</div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {locationName}
                  </div>
                  <div className="text-cyan-300 font-mono text-xs">
                    {selectedLocation.lat.toFixed(4)},{" "}
                    {selectedLocation.lon.toFixed(4)}
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => {
                  setSelectedLocation(null);
                  setLocationName("");
                  setAqiData(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs py-1 rounded-lg transition-all duration-200"
              >
                Clear Location
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
