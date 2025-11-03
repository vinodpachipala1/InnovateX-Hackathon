import React from 'react';
import { motion } from 'framer-motion';


const AIAdvice = ({ advice, persona, loading, locationName }) => {
  

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 h-64 shadow-xl shadow-cyan-500/5"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-cyan/20 to-accent-emerald/20 rounded-lg flex items-center justify-center">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-lg text-accent-cyan-light"
            >
              🧠
            </motion.span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">AI Health Advisor</h3>
            <p className="text-sm text-gray-300">Analyzing your air quality...</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl mb-2"
            >
              ⚡
            </motion.div>
            <p className="text-gray-400 text-sm">Generating personalized health advice</p>
            <p className="text-cyan-400 text-xs mt-1">Powered by AI</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Increased height to h-auto with a min-height to accommodate variable content
      className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 min-h-64 shadow-xl shadow-cyan-500/5"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-accent-cyan/20 to-accent-emerald/20 rounded-lg flex items-center justify-center">
          <span className="text-lg text-accent-cyan-light">🧠</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">AI Health Advisor</h3>
          <p className="text-sm text-gray-300">
            {locationName ? `Personalized for ${locationName}` : `Personalized for ${persona} profile`}
          </p>
        </div>
      </div>

      {advice ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          // === THIS IS THE FIX ===
          // Removed max-h-40 and overflow-y-auto to allow full content height
          className="max-w-none" 
          // (Removed custom-scrollbar as it's not needed without overflow)
        >
          {/* === UPDATED RENDER LOGIC === */}
          <div className="text-gray-200 leading-relaxed pr-2 text-sm">
            {/* 1. Render the title */}
            <h4 className="font-semibold text-white mb-2">{advice.title}</h4>
            
            {/* 2. Map over the recommendations array */}
            <ul className="list-disc list-inside space-y-1.5">
              {advice.recommendations && advice.recommendations.map((rec, index) => (
                <li key={index} className="leading-snug">{rec}</li>
              ))}
            </ul>
            
            {/* 3. Render the precaution if it exists */}
            {advice.precaution && (
              <p className="mt-3 text-cyan-200 text-xs italic">
                <strong>Precaution:</strong> {advice.precaution}
              </p>
            )}
          </div>
          {/* === END OF UPDATE === */}

          <div className="mt-3 pt-3 border-t border-cyan-500/20">
            <p className="text-cyan-400 text-xs">🤖 AI-powered health guidance</p>
          </div>
        </motion.div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2 text-accent-cyan-light">💡</div>
            <p className="text-gray-300">Get AI-powered health advice by selecting a location</p>
            <p className="text-cyan-400 text-xs mt-1">Personalized for your profile</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIAdvice;