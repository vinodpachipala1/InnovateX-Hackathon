import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">About AQI Sense</h1>
        <p className="text-xl text-gray-300">
          Transforming air quality data into actionable health intelligence
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-card rounded-xl p-6 border border-gray-800"
        >
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-300 leading-relaxed">
            AQI Sense goes beyond traditional air quality apps by providing AI-powered, 
            personalized health recommendations based on real-time environmental data. 
            We believe everyone deserves to breathe safely and make informed decisions 
            about their outdoor activities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-card rounded-xl p-6 border border-gray-800"
        >
          <h3 className="text-2xl font-semibold mb-4">Hackathon Project</h3>
          <p className="text-gray-300 leading-relaxed">
            Built during a 24-hour hackathon under the EnviroTech theme, 
            AQI Sense demonstrates how technology can create meaningful impact 
            in environmental health awareness and personal safety.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;