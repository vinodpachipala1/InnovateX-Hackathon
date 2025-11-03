import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">About AQI Sense</h1>
        <p className="text-xl text-gray-300">
          AI-powered air quality intelligence for healthier living
        </p>
      </motion.div>

      {/* Mission & Hackathon */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-card rounded-xl p-6 border border-gray-800"
        >
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-300 leading-relaxed">
            AQI Sense transforms raw air-quality data into personalized
            health insights using AI. Our mission is to help individuals make
            better decisions, stay protected, and breathe safe in an increasingly
            polluted environment.
          </p>
        </motion.div>

        {/* Hackathon Context */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-card rounded-xl p-6 border border-gray-800"
        >
          <h3 className="text-2xl font-semibold mb-4">Hackathon Project</h3>
          <p className="text-gray-300 leading-relaxed">
            Built in a 24-hour hackathon under the EnviroTech theme, AQI Sense
            demonstrates the power of AI-driven environmental intelligence to
            safeguard communities and promote public health awareness.
          </p>
        </motion.div>
      </div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card rounded-xl px-6 py-8 border border-gray-800 mt-10 text-center"
      >
        <h3 className="text-2xl font-semibold mb-4">Team Behind AQI Sense</h3>
        <p className="text-gray-300 mb-4">Created by:</p>
        
        <div className="text-lg font-medium text-gray-200 space-y-1">
          <p>👨‍💻 Vinod Pachipala</p>
          <p>👨‍💻 Sampath Magapu</p>
          <p>👨‍💻 Naresh Devendiran</p>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Innovating for a cleaner, safer future.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
