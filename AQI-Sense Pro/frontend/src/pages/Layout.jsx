import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, Link } from 'react-router-dom';
import StarField from './StarField';


// --- ANIMATION VARIANTS ---
const navVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  },
  hover: {
    y: -2,
    transition: { type: 'spring', stiffness: 300 }
  }
};

const underlineVariants = {
  hidden: { width: 0 },
  visible: {
    width: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  hover: {
    width: "100%",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
}

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// --- LAYOUT COMPONENT ---
const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      
      {/* Background Layers */}
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-black via-gray-950 to-emerald-950" />
      
      {/* Star Field Background */}
      <div className="fixed inset-0 -z-30 overflow-hidden">
        <StarField />
      </div>

      {/* Animated Grid Background */}
      <div className="fixed inset-0 -z-20 opacity-20">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ["0% 0%", "50px 50px"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Aurora Glow */}
      <motion.div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh]
                      bg-gradient-radial from-emerald-500/10 via-transparent to-transparent
                      blur-3xl rounded-full -z-20 pointer-events-none"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Animated Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -50, 50, 0, 0],
            scale: [1, 1.5, 1, 2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -150, 0, 150, 0],
            y: [0, 80, -80, 0, 0],
            scale: [1, 2, 1, 1.5, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-3/4 w-56 h-56 bg-violet-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 80, -80, 0, 0],
            y: [0, -100, 100, 0, 0],
            scale: [1, 1.8, 1, 2.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Animated Noise Texture */}
      <div className="fixed inset-0 -z-1 opacity-[0.04] mix-blend-overlay" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           }}>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative border-b border-gray-800 bg-black/70 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <Link to="/" className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/20"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 25px 50px -12px rgb(52 211 153 / 0.2)",
                      "0 25px 60px -10px rgb(52 211 153 / 0.3)",
                      "0 25px 50px -12px rgb(52 211 153 / 0.2)",
                    ]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    🌍
                  </motion.span>
                </motion.div>
                <div>
                  <motion.h1 
                    className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0%', '100%', '0%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  >
                    AQI Sense
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    AI Health Companion
                  </motion.p>
                </div>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex space-x-8"
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative text-gray-400 hover:text-white transition-colors py-2 group"
                >
                  <motion.span
                    className={`block ${isActivePath(item.path) ? 'text-cyan-300' : ''}`}
                    variants={navItemVariants}
                    whileHover="hover"
                  >
                    {item.name}
                  </motion.span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400"
                    variants={underlineVariants}
                    initial={isActivePath(item.path) ? "hover" : "visible"}
                    animate={isActivePath(item.path) ? "hover" : "visible"}
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden mt-4 border-t border-gray-800 pt-4 overflow-hidden"
              >
                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`py-3 px-4 rounded-lg transition-all duration-200 ${
                        isActivePath(item.path) 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {item.name === 'Home' && '🏠'}
                          {item.name === 'Dashboard' && '📊'}
                          {item.name === 'About' && 'ℹ️'}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="container mx-auto px-4 py-8 relative z-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative border-t border-gray-800 bg-black/70 backdrop-blur-lg mt-auto"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <motion.p 
              className="text-gray-500 text-sm"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                y: [0, -2, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🚀 Built at Hackathon 2025 • EnviroTech Theme
            </motion.p>
            <div className="flex justify-center space-x-6 mt-3">
              <a href="/" className="text-gray-500 hover:text-cyan-300 transition-colors text-xs">Home</a>
              <a href="/dashboard" className="text-gray-500 hover:text-cyan-300 transition-colors text-xs">Dashboard</a>
              <a href="/about" className="text-gray-500 hover:text-cyan-300 transition-colors text-xs">About</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;