import React from 'react';
import { motion } from 'framer-motion';

const PersonaSelector = ({ selectedPersona, onPersonaChange }) => {
  const personas = [
    { id: 'general', icon: '👤', label: 'General Public', desc: 'Standard health advice' },
    { id: 'athlete', icon: '🏃', label: 'Athlete', desc: 'Exercise & training guidance' },
    { id: 'children', icon: '👶', label: 'With Children', desc: 'Child-specific safety' },
    { id: 'sensitive', icon: '❤️', label: 'Health Sensitive', desc: 'Respiratory conditions' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass-dark backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-500/5"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
        <span className="text-accent-cyan-light">🎯</span>
        <span>Select Your Profile</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {personas.map((persona, index) => (
          <motion.button
            key={persona.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPersonaChange(persona.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
              selectedPersona === persona.id
                ? 'border-accent-cyan bg-gradient-to-r from-accent-cyan/10 to-accent-emerald/10 shadow-lg shadow-accent-cyan/20'
                : 'border-cyan-500/20 hover:border-cyan-400/40 bg-glass-light'
            }`}
          >
            <motion.div 
              className="text-2xl mb-3"
              animate={{ 
                scale: selectedPersona === persona.id ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {persona.icon}
            </motion.div>
            <div className="font-medium text-sm mb-1 text-white">{persona.label}</div>
            <div className="text-xs text-gray-300 leading-tight">{persona.desc}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonaSelector;