import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-6xl mx-auto relative z-10 px-6 py-12"
      >
        {/* Enhanced Hero Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <motion.div
            className="relative inline-block mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mx-auto mb-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <motion.span
                className="text-4xl relative z-10"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                🌍
              </motion.span>
            </div>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-lg opacity-0 hover:opacity-100 transition-opacity duration-500"
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              AQI-Sense Pro
            </span>
            
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-100 mb-6 font-light"
            variants={itemVariants}
          >
            Your <span className="font-semibold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">AI Health Companion</span>
          </motion.p>

          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            variants={itemVariants}
          >
            Transform air quality data into <span className="text-cyan-300 font-medium">personalized health advice</span> and 
            <span className="text-emerald-300 font-medium"> intelligent safety alerts</span>. Breathe smarter with AI-powered environmental awareness.
          </motion.p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto"
          variants={containerVariants}
        >
          {[
            { 
              icon: '🧠', 
              title: 'AI Intelligence', 
              desc: 'Smart health recommendations tailored to your specific profile and needs',
            },
            { 
              icon: '🌍', 
              title: 'Live Global Data', 
              desc: 'Real-time AQI from thousands of monitoring stations worldwide',
            },
            { 
              icon: '🚨', 
              title: 'Smart Alerts', 
              desc: 'Proactive notifications when air quality affects your health',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative group"
            >
              <div className="relative bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/20 
                            transition-all duration-500 h-full group-hover:bg-black/60 
                            shadow-lg group-hover:shadow-cyan-500/10
                            hover:border-cyan-400/40">
                {/* Feature Icon */}
                <motion.div
                  className="text-4xl mb-6 bg-gradient-to-br from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {feature.icon}
                </motion.div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed font-light">
                  {feature.desc}
                </p>
                
                {/* Hover Indicator */}
                <motion.div 
                  className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                  initial={false}
                  whileHover={{ 
                    width: "60%",
                    x: "-50%",
                    transition: { duration: 0.4 }
                  }}
                />
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(34, 211, 238, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="relative bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white px-12 py-4 rounded-2xl text-xl font-semibold shadow-2xl border border-cyan-400/30 transition-all duration-300 group overflow-hidden"
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <span className="relative z-10 flex items-center space-x-3">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                🌟
              </motion.span>
              <span>Start Breathing Smarter</span>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
          
          <motion.p 
            className="text-cyan-300/70 text-lg font-light"
            animate={{ 
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
          >
            Join thousands of users breathing safer with AI-powered insights
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;