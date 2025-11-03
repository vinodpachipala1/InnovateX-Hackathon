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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        {/* New: Purple accent glow */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-6xl mx-auto relative z-10"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <motion.div
            className="inline-block mb-8"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-emerald-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 mx-auto mb-6">
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                🌍
              </motion.span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-8"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
              AQI Sense
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8"
            variants={itemVariants}
          >
            Your <span className="font-semibold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">AI Health Companion</span>
          </motion.p>

          <motion.p 
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform raw air quality data into <span className="text-cyan-300 font-medium">personalized health advice</span> and 
            <span className="text-emerald-300 font-medium"> automated safety alerts</span>. Breathe smarter with AI-powered environmental awareness.
          </motion.p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
        >
          {[
            { 
              icon: '🧠', 
              title: 'AI Intelligence', 
              desc: 'Smart health recommendations tailored to your profile',
              gradient: 'from-cyan-500/20 to-emerald-500/20',
              border: 'border-cyan-400/40',
              hoverGlow: 'group-hover:shadow-cyan-500/20'
            },
            { 
              icon: '🌍', 
              title: 'Live Data', 
              desc: 'Real-time AQI from global monitoring stations',
              gradient: 'from-emerald-500/20 to-violet-500/20',
              border: 'border-emerald-400/40',
              hoverGlow: 'group-hover:shadow-emerald-500/20'
            },
            { 
              icon: '🚨', 
              title: 'Smart Alerts', 
              desc: 'Instant notifications when air quality drops',
              gradient: 'from-violet-500/20 to-cyan-500/20',
              border: 'border-violet-400/40',
              hoverGlow: 'group-hover:shadow-violet-500/20'
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              {/* Animated glow border */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500`}
                animate={{
                  opacity: [0, 0.2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.8
                }}
              />
              
              <div className={`relative bg-black/50 backdrop-blur-md p-6 rounded-xl border ${feature.border} 
                            transition-all duration-300 h-full group-hover:bg-black/60 
                            shadow-lg ${feature.hoverGlow}`}>
                <motion.div
                  className="text-3xl mb-4"
                  animate={{ 
                    y: [0, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                
                {/* Enhanced hover indicator */}
                <motion.div 
                  className="absolute bottom-3 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400"
                  initial={false}
                  whileHover={{ 
                    width: "50%",
                    x: "-50%",
                    transition: { duration: 0.3 }
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3), 0 0 80px rgba(52, 211, 153, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-xl overflow-hidden group border border-cyan-400/30"
          >
            {/* Enhanced shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            
            {/* Continuous glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl border border-white/20"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            
            <span className="relative z-10 flex items-center space-x-3">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                🚀
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
            className="text-cyan-300/80 mt-6 text-sm"
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            Join thousands already breathing safer with AI
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Subtle floating accent elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400/30 rounded-full blur-sm"
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-emerald-400/30 rounded-full blur-sm"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 2
        }}
      />
    </div>
  );
};

export default Home;