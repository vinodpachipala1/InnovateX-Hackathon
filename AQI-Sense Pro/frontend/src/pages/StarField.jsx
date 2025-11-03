import React from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  const shootingStars = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 15,
  }));

  return (
    <>
      {/* Static Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Twinkling Stars */}
      {stars.slice(0, 30).map((star) => (
        <motion.div
          key={`twinkle-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 1.5}px`,
            height: `${star.size * 1.5}px`,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: Math.random() * 3 + 1,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          className="absolute w-1 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            rotate: '45deg',
          }}
          animate={{
            x: ['0vw', '100vw'],
            y: ['0vh', '100vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Constellation Lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.1 }}
      >
        {stars.slice(0, 20).map((star, index) => {
          if (index % 3 === 0 && stars[index + 1]) {
            return (
              <motion.line
                key={`line-${index}`}
                x1={`${star.x}%`}
                y1={`${star.y}%`}
                x2={`${stars[index + 1].x}%`}
                y2={`${stars[index + 1].y}%`}
                stroke="white"
                strokeWidth="0.5"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          }
          return null;
        })}
      </motion.svg>
    </>
  );
};

export default StarField;